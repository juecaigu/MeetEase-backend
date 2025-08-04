import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }

  async expire(key: string, ttl: number) {
    await this.redisClient.expire(key, ttl);
  }

  async hget(key: string) {
    return await this.redisClient.hGetAll(key);
  }

  async hset(key: string, fields: Record<string, string>, ttl?: number) {
    for (const [field, value] of Object.entries(fields)) {
      await this.redisClient.hSet(key, field, value);
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async hdel(key: string, field: string) {
    await this.redisClient.hDel(key, field);
  }
}
