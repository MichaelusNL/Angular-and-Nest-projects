import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from './redis.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 63679,
    }),
  ],
  providers: [RedisService],
  exports: [JwtModule, CacheModule, RedisService],
})
export class SharedModule {}
