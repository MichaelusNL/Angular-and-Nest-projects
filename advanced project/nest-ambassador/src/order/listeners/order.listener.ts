import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisService } from '../../shared/redis.service';
import { Order } from '../order';

@Injectable()
export class OrderListener {
  constructor(
    private redisService: RedisService,
    private mailerService: MailerService,
  ) {}

  @OnEvent('order.completed')
  async handleOrderCompletedEvent(order: Order) {
    const client = this.redisService.getClient();
    client.zincrby('rankings', order.ambassadorRevenue, order.user.name);

    await this.mailerService.sendMail({
      to: 'admin@admin.com',
      subject: 'An order has been completed',
      html: `Order #${order.id} with a total of $${order.total} has been completed`,
    });

    await this.mailerService.sendMail({
      to: order.ambassadorEmail,
      subject: 'An order has been completed',
      html: `You earned $${order.ambassadorRevenue} from the link #${order.code}`,
    });
  }
}
