import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productTitle: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  adminRevenue: number;

  @Column()
  ambassadorRevenue: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  //   @JoinColumn({ name: 'orderId' })
  order: Order;
}
