import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService, ConfigModule } from '@nestjs/config';

const redisModule = {
  imports: [ConfigModule],
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const client = createClient({
      socket: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
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
