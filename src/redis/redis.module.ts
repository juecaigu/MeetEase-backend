import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

const redisModule = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      socket: {
        host: 'localhost',
        port: 6379,
      },
    });
    await client.connect();
    return client;
  },
};

@Global()
@Module({
  providers: [RedisService, redisModule],
  exports: [RedisService],
})
export class RedisModule {}
