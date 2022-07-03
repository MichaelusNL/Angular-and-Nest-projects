import { NestFactory } from '@nestjs/core';
import { RedisService } from '../shared/redis.service';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);

  const ambassadors = await userService.find({
    isAmbassador: true,
    relations: ['orders', 'orders.orderItems'],
  });

  const redisService = app.get(RedisService);
  const client = redisService.getClient();

  for (let i = 0; i < ambassadors.length; i++) {
    client.zadd('rankings', ambassadors[i].revenue, ambassadors[i].name);
  }

  process.exit();
})();
