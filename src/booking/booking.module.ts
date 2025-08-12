import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Attendees } from './entities/attendees.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Attendees, MeetingRoom, User])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
