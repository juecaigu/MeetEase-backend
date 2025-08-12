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
        meetingRoomId: meetingRoomId,
        startTime: LessThanOrEqual(nearestHalfHourStartTime),
        endTime: MoreThanOrEqual(nearestHalfHourEndTime),
        status: BookingStatus.DOING,
      },
    });
    if (booking) {
      throw new BadRequestException('会议室已被占用');
    }
    const newBooking = new Booking();
    newBooking.startTime = nearestHalfHourStartTime;
    newBooking.endTime = nearestHalfHourEndTime;
    newBooking.meetingRoomId = meetingRoomId;
    newBooking.meetingRoomName = meetingRoomName;
    newBooking.meetingRoomLocation = meetingRoomLocation;
    newBooking.meetingRoomCode = meetingRoomCode || '';
    newBooking.remark = remark;
    newBooking.userId = id;
    newBooking.userName = username;
    newBooking.userCode = userInfo.userCode;
    newBooking.userPhone = userInfo.phone;
    newBooking.status = BookingStatus.DOING;
    if (Array.isArray(attendees) && attendees.length > 0) {
      const attendeesInfo = attendees.map((attendee) => {
        const { userId, name, phone, email, userCode } = attendee;
        return {
          name,
          phone,
          email,
          userCode,
          userId,
        };
      });
      newBooking.attendees = attendeesInfo as Attendees[];
    }
    await this.bookingRepository.save(newBooking);
    return '预订成功';
  }
}
