import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RedisService } from '../shared/redis.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  @Get('admin/ambassadors')
  @UseInterceptors(ClassSerializerInterceptor)
  ambassadors() {
    return this.userService.find({
      isAmbassador: true,
    });
  }

  @Get('ambassador/rankings')
  async rankings(@Res() response: Response) {
    const client = this.redisService.getClient();

    client.zrevrangebyscore(
      'rankings',
      '+inf',
      '-inf',
      'withscores',
      (err, result) => {
        const obj = {};

        for (let i = 0; i < result.length; i += 2) {
          obj[result[i]] = result[i + 1];
        }
        response.send(obj);
      },
    );
  }
}
