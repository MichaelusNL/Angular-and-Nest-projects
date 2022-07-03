import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { Order } from './order.entity';

@Injectable()
export class OrderService extends AbstractService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async chart() {
    return this.orderRepository.query(`
      SELECT DATE_FORMAT(o.createdAt, '%Y-%m-%d') as date, sum(i.price * i.quantity) as sum
      FROM orders o
      JOIN order_items i on o.id = i.orderId
      GROUP BY date;
    `);
  }
}
