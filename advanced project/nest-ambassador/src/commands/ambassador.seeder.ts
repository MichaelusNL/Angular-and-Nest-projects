import { NestFactory } from '@nestjs/core';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);

  const password = await bcrypt.hash('1234', 12);

  for (let i = 0; i < 30; i++) {
    await userService.save({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password,
      isAmbassador: true,
    });
  }

  process.exit();
})();
