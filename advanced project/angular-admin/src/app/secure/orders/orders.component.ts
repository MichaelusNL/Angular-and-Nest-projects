import { Component, OnInit } from '@angular/core';
import { Order } from '../../../app/interfaces/order';
import { OrderService } from '../../../app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.all().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
