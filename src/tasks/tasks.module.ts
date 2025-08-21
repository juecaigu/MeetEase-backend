import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [TasksService],
})
export class TasksModule {}
