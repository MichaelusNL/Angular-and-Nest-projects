import { NestFactory } from '@nestjs/core';
import { faker } from '@faker-js/faker';
import { AppModule } from '../app.module';
import { randomInt } from 'crypto';
import { OrderService } from '../order/order.service';
import { OrderItemService } from '../order/order-item.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const orderService = app.get(OrderService);
  const orderItemService = app.get(OrderItemService);

  for (let i = 0; i < 30; i++) {
    const order = await orderService.save({
      userId: randomInt(2, 61),
      code: faker.lorem.slug(2),
      ambassadorEmail: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      complete: true,
    });

    for (let j = 0; j < randomInt(1, 5); j++) {
      await orderItemService.save({
        order,
        productTitle: faker.lorem.words(2),
        price: randomInt(10, 100),
        quantity: randomInt(1, 5),
        adminRevenue: randomInt(10, 100),
        ambassadorRevenue: randomInt(1, 10),
      });
    }
  }

  process.exit();
})();
