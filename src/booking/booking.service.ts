import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtPayload } from 'src/user/login.guard';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, MoreThanOrEqual, FindOptionsWhere, Like } from 'typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { BookingStatus } from './type';
import { Attendees } from './entities/attendees.entity';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { ListBookingDto } from './dto/list-booking.dto';
import { BookingVo } from './vo/booking.vo';
import { MeetingRoomStatus } from 'src/meeting-room/type';
import * as dayjs from 'dayjs';

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
    const { startTime, endTime, meetingRoomId, attendees, remark, title } = createBookingDto;
    const meetingRoom = await this.meetingRoomRepository.findOne({
      where: { id: meetingRoomId, status: MeetingRoomStatus.FREE },
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在或不可用');
    }
    const { id, username } = user;
    const userInfo = await this.userRepository.findOne({ where: { id } });
    if (!userInfo) {
      throw new BadRequestException('用户不存在');
    }
    const nearestHalfHourStartTime = this.getNearestHalfHour(startTime);
    const nearestHalfHourEndTime = this.getNearestHalfHour(endTime);
    if (nearestHalfHourStartTime < new Date()) {
      throw new BadRequestException('开始时间不能小于当前时间');
    }
    if (nearestHalfHourStartTime >= nearestHalfHourEndTime) {
      throw new BadRequestException('开始时间不能大于结束时间');
    }

    const booking = await this.bookingRepository.findOne({
      where: {
        meetingRoom: {
          id: meetingRoomId,
        },
        startTime: LessThanOrEqual(nearestHalfHourStartTime),
        endTime: MoreThanOrEqual(nearestHalfHourEndTime),
        status: BookingStatus.DOING,
      },
    });
    if (booking) {
      throw new BadRequestException('会议室已被占用');
    }
    const sameUserBooking = await this.bookingRepository.findOne({
      where: {
        userId: id,
        status: BookingStatus.DOING,
        startTime: LessThanOrEqual(nearestHalfHourStartTime),
        endTime: MoreThanOrEqual(nearestHalfHourEndTime),
      },
    });
    if (sameUserBooking) {
      throw new BadRequestException('用户已有正在进行的会议');
    }
    const newBooking = new Booking();
    newBooking.startTime = nearestHalfHourStartTime;
    newBooking.endTime = nearestHalfHourEndTime;
    newBooking.remark = remark;
    newBooking.userId = id;
    newBooking.title = title;
    newBooking.userName = username;
    newBooking.userCode = userInfo.userCode;
    newBooking.userPhone = userInfo.phone;
    newBooking.userNickname = userInfo.nickname;
    newBooking.status = BookingStatus.CONFIRMED;
    newBooking.meetingRoom = meetingRoom;
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

  async list(listBookingDto: ListBookingDto) {
    const { pageNo, pageSize, status, startTime, endTime, userName, title, meetingRoomName } = listBookingDto;
    const where: FindOptionsWhere<Booking> = {};
    if (status) {
      where.status = status;
    }
    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (startTime && endTime) {
      where.startTime = LessThanOrEqual(new Date(endTime));
      where.endTime = MoreThanOrEqual(new Date(startTime));
    }
    if (userName) {
      where.userName = Like(`%${userName}%`);
    }
    if (meetingRoomName) {
      where.meetingRoom = {
        name: Like(`%${meetingRoomName}%`),
      };
    }
    const [list, total] = await this.bookingRepository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        createTime: 'DESC',
      },
      relations: ['attendees', 'meetingRoom'],
    });
    const voList = list.map((item) => {
      const vo = new BookingVo();
      vo.id = item.id;
      vo.title = item.title;
      vo.startTime = dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss');
      vo.endTime = dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss');
      vo.userName = item.userName;
      vo.userCode = item.userCode;
      vo.status = item.status;
      vo.remark = item.remark;
      vo.cancelTime = item.cancelTime ? dayjs(item.cancelTime).format('YYYY-MM-DD HH:mm:ss') : '';
      vo.cancelReason = item.cancelReason;
      vo.cancelUserId = item.cancelUserId;
      vo.cancelUserName = item.cancelUserName;
      vo.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      vo.meetingRoom = item.meetingRoom;
      // vo.attendees = (item.attendees || []).map((attendee) => {
      //   const vo = new AttendeesVo();
      //   vo.id = attendee.id;
      //   vo.code = attendee.userCode || '';
      //   vo.name = attendee.name || '';
      //   vo.phone = attendee.phone;
      //   vo.email = attendee.email;
      //   return vo;
      // });
      return vo;
    });
    return { list: voList, total };
  }

  async cancel(cancelBookingDto: CancelBookingDto, user: JwtPayload) {
    const { id, cancelReason } = cancelBookingDto;
    const { id: userId, username } = user;
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new BadRequestException('预订记录不存在');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      return '预订已被取消';
    }
    booking.status = BookingStatus.CANCELLED;
    booking.cancelTime = new Date();
    booking.cancelUserId = userId;
    booking.cancelUserName = username;
    booking.cancelReason = cancelReason;
    await this.bookingRepository.save(booking);
    return '取消成功';
  }
}
