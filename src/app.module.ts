import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { LoginGuard } from './user/login.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PermissionGuard } from './permission/permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { Equipment } from './equipment/entities/equipment.entity';
import { EquipmentModule } from './equipment/equipment.module';
import { ImageModule } from './image/image.module';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['src/.env'],
  cache: true,
});

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  global: true,
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
  }),
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
    entities: [User, Role, Permission, MeetingRoom, Equipment],
    synchronize: true,
    logging: true,
    connectorPackage: 'mysql2',
    extra: {
      authPlugin: 'sha256_password',
    },
  }),
});

@Module({
  imports: [
    typeOrmModule,
    UserModule,
    RedisModule,
    configModule,
    jwtModule,
    EmailModule,
    RoleModule,
    PermissionModule,
    MeetingRoomModule,
    EquipmentModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
