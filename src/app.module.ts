import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
  cache: true,
});

const typeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: configService.get<'mysql' | 'mariadb'>('DB_TYPE'),
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [User, Role, Permission],
    synchronize: true,
    logging: true,
    connectorPackage: 'mysql2',
    extra: {
      authPlugin: 'sha256_password',
    },
  }),
});

@Module({
  imports: [typeOrmModule, UserModule, RedisModule, configModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
