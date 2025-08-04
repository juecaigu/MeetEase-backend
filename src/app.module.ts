import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';

const typeOrmModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'jiang',
  database: 'meetease_db',
  entities: [User, Role, Permission],
  synchronize: true,
  logging: true,
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
});
@Module({
  imports: [typeOrmModule, UserModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
