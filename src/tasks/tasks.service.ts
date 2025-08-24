import { Injectable } from '@nestjs/common';
import { Booking } from 'src/booking/entities/booking.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatus } from 'src/booking/type';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleBookingStatus() {
    try {
      void this.bookingRepository.update(
        {
          status: BookingStatus.CONFIRMED,
          startTime: LessThanOrEqual(new Date()),
        },
        {
          status: BookingStatus.DOING,
        },
      );
      void this.bookingRepository.update(
        {
          status: BookingStatus.DOING,
          endTime: LessThanOrEqual(new Date()),
        },
        {
          status: BookingStatus.COMPLETED,
        },
      );
    } catch (error) {
      console.error('更新会议状态失败', error);
    }
  }
}
