import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Link } from '../link/link';
import { LinkService } from '../link/link.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './order';
import { OrderService } from './order.service';
import { ProductService } from '../product/product.service';
import { OrderItem } from './order-item';
import { OrderItemService } from './order-item.service';
import { Connection } from 'typeorm';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService,
    private linkService: LinkService,
    private productService: ProductService,
    private orderItemService: OrderItemService,
    private connection: Connection,
    @InjectStripe() private readonly stripeClient: Stripe,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('admin/orders')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  all() {
    return this.orderService.find({ relations: ['orderItems'] });
  }

  @Post('checkout/orders')
  async create(@Body() body: CreateOrderDto) {
    const link: Link = await this.linkService.findOne({
      where: { code: body.code },
      relations: ['user'],
    });

    if (!link) {
      throw new BadRequestException('Invalid Link');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const o = new Order();
      o.userId = link.user.id;
      o.ambassadorEmail = link.user.email;
      o.firstName = body.firstName;
      o.lastName = body.lastName;
      o.email = body.email;
      o.address = body.address;
      o.country = body.country;
      o.city = body.city;
      o.zip = body.zip;
      o.code = body.code;

      const order = await queryRunner.manager.save(o);

      const lineItems = [];

      for (const p of body.products) {
        const product = await this.productService.findOne({
          where: { id: p.productId },
        });

        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.productTitle = product.title;
        orderItem.price = product.price;
        orderItem.quantity = p.quantity;
        orderItem.ambassadorRevenue = 0.1 * product.price * p.quantity;
        orderItem.adminRevenue = 0.9 * product.price * p.quantity;

        await queryRunner.manager.save(orderItem);

        lineItems.push({
          name: product.title,
          description: product.description,
          images: [product.image],
          amount: 100 * product.price,
          currency: 'usd',
          quantity: p.quantity,
        });
      }

      const source = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: `${this.configService.get(
          'CHECKOUT_URL',
        )}/success?source={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('CHECKOUT_URL')}/error`,
      });

      order.transactionId = source.id;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return source;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  @Post('checkout/orders/confirm')
  async confirm(@Body('source') source: string) {
    const order = await this.orderService.findOne({
      where: { transactionId: source },
      relations: ['orderItems', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order Not found');
    }

    await this.orderService.update(order.id, {
      complete: true,
    });

    await this.eventEmitter.emit('order.completed', order);

    return {
      message: 'Success',
    };
  }
}
