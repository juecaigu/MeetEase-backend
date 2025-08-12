import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtPayload } from 'src/user/login.guard';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, MoreThanOrEqual } from 'typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { BookingStatus } from './type';
import { Attendees } from './entities/attendees.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private getNearestHalfHour(date: string): Date {
    const dateObj = new Date(date);
    const time = dateObj.getTime();
    const msPerHalfHour = 30 * 60 * 1000; // 半小时的毫秒数
    return new Date(Math.round(time / msPerHalfHour) * msPerHalfHour);
  }

  async create(createBookingDto: CreateBookingDto, user: JwtPayload) {
    const {
      startTime,
      endTime,
      meetingRoomCode,
      meetingRoomName,
      meetingRoomLocation,
      meetingRoomId,
      attendees,
      remark,
    } = createBookingDto;
    const meetingRoom = await this.meetingRoomRepository.findOne({ where: { id: meetingRoomId } });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    const { id, username } = user;
    const userInfo = await this.userRepository.findOne({ where: { id } });
    if (!userInfo) {
      throw new BadRequestException('用户不存在');
    }
    const nearestHalfHourStartTime = this.getNearestHalfHour(startTime);
    const nearestHalfHourEndTime = this.getNearestHalfHour(endTime);

    const booking = await this.bookingRepository.findOne({
      where: {
        meeting_room_id: meetingRoomId,
        start_time: LessThanOrEqual(nearestHalfHourStartTime),
        end_time: MoreThanOrEqual(nearestHalfHourEndTime),
        status: BookingStatus.DOING,
      },
    });
    if (booking) {
      throw new BadRequestException('会议室已被占用');
    }
    const newBooking = new Booking();
    newBooking.start_time = nearestHalfHourStartTime;
    newBooking.end_time = nearestHalfHourEndTime;
    newBooking.meeting_room_id = meetingRoomId;
    newBooking.meeting_room_name = meetingRoomName;
    newBooking.meeting_room_location = meetingRoomLocation;
    newBooking.meeting_room_code = meetingRoomCode || '';
    newBooking.remark = remark;
    newBooking.user_id = id;
    newBooking.user_name = username;
    newBooking.user_code = userInfo.user_code;
    newBooking.user_phone = userInfo.phone;
    newBooking.status = BookingStatus.DOING;
    if (Array.isArray(attendees) && attendees.length > 0) {
      const attendeesInfo = attendees.map((attendee) => {
        const { id, name, phone, email, user_code } = attendee;
        return {
          name,
          phone,
          user_id: id,
          email,
          user_code,
        };
      });
      newBooking.attendees = attendeesInfo as Attendees[];
    }
    await this.bookingRepository.save(newBooking);
    return '预订成功';
  }
}
