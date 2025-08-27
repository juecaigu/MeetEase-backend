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
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';
import { Attendees } from './booking/entities/attendees.entity';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local'],
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
  useFactory: (configService: ConfigService) => {
    return {
      type: configService.get<'mysql' | 'mariadb'>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [User, Role, Permission, MeetingRoom, Equipment, Booking, Attendees],
      synchronize: true,
      logging: ['query', 'error'],
      maxQueryExecutionTime: configService.get<number>('MAX_QUERY_EXECUTION_TIME'),
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    };
  },
});

const loggerModule = WinstonModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    level: configService.get<string>('LOG_LEVEL'),
    transports: [
      new winston.transports.DailyRotateFile({
        dirname: `${process.cwd()}/logs`,
        filename: configService.get<string>('LOG_FILE_NAME'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        json: false,
        maxSize: configService.get<string>('LOG_MAX_SIZE'),
        maxFiles: configService.get<string>('LOG_MAX_FILES'),
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.json(),
        ),
      }),
      new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
      }),
    ],
  }),
});

@Module({
  imports: [
    ScheduleModule.forRoot(),
    typeOrmModule,
    UserModule,
    RedisModule,
    configModule,
    jwtModule,
    loggerModule,
    EmailModule,
    RoleModule,
    PermissionModule,
    MeetingRoomModule,
    EquipmentModule,
    BookingModule,
    TasksModule,
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
