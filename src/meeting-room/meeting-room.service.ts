import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { In, Repository } from 'typeorm';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { SearchMeetingRoomDto } from './dto/search-meeting-room.dto';
import { Expression } from 'src/type/type';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomStatus } from './type';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingStatus } from 'src/booking/type';
import { JwtPayload } from 'src/user/login.guard';
import { BookingMeetingRoomDto } from './dto/booking-meeting-room.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom) private readonly meetingRoomRepository: Repository<MeetingRoom>,
    @InjectRepository(Equipment) private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const meetingRoom = new MeetingRoom();
    meetingRoom.code = createMeetingRoomDto.code;
    meetingRoom.name = createMeetingRoomDto.name;
    meetingRoom.description = createMeetingRoomDto.description;
    meetingRoom.status = createMeetingRoomDto.status;
    meetingRoom.capacity = createMeetingRoomDto.capacity;
    meetingRoom.location = createMeetingRoomDto.location;
    const equipment = await this.equipmentRepository.find({ where: { id: In(createMeetingRoomDto.equipment) } });
    meetingRoom.equipment = equipment;
    await this.meetingRoomRepository.save(meetingRoom);
    return '创建成功';
  }

  async update(updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const { id, name, location, status, capacity, description } = updateMeetingRoomDto;
    const findMeetingRoom = await this.meetingRoomRepository.findOne({ where: { id } });
    if (!findMeetingRoom) {
      throw new NotFoundException('会议室不存在');
    }
    Object.assign(findMeetingRoom, { name, location, status, capacity, description });
    await this.meetingRoomRepository.update(id, findMeetingRoom);
    return '更新成功';
  }

  async updateEquipment(updateMeetingRoomDto: { id: number; equipment: number[] }) {
    const { id, equipment } = updateMeetingRoomDto;
    const findMeetingRoom = await this.meetingRoomRepository.findOne({ where: { id } });
    if (!findMeetingRoom) {
      throw new NotFoundException('会议室不存在');
    }
    const equipmentList = await this.equipmentRepository.find({ where: { id: In(equipment) } });
    findMeetingRoom.equipment = equipmentList;
    await this.meetingRoomRepository.save(findMeetingRoom);
    return '更新成功';
  }

  async updateStatus(query: { id: number; status: MeetingRoomStatus }) {
    const { id, status } = query;
    const findMeetingRoom = await this.meetingRoomRepository.findOne({ where: { id } });
    if (!findMeetingRoom) {
      throw new NotFoundException('会议室不存在');
    }
    if (status === findMeetingRoom.status) {
      return '更新成功';
    }
    await this.meetingRoomRepository.update(id, { status });
    return '更新成功';
  }

  async list(searchMeetingRoomDto: SearchMeetingRoomDto) {
    const { pageNo, pageSize, name, code, location, status, capacity } = searchMeetingRoomDto;
    const queryBuilder = this.meetingRoomRepository.createQueryBuilder('meetingRoom');
    if (name) {
      queryBuilder.where('meetingRoom.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.where('meetingRoom.code LIKE :code', { code: `%${code}%` });
    }
    if (location) {
      queryBuilder.where('meetingRoom.location LIKE :location', { location: `%${location}%` });
    }
    if (status) {
      queryBuilder.where('meetingRoom.status = :status', { status });
    }
    if (capacity?.expression && capacity?.value !== undefined) {
      const { expression, value } = capacity;
      if (expression === Expression.BETWEEN) {
        queryBuilder.where('meetingRoom.capacity BETWEEN :capacity1 AND :capacity2', {
          capacity1: value[0] as number,
          capacity2: value[1] as number,
        });
      } else {
        queryBuilder.where(`meetingRoom.capacity ${expression} :capacity`, { capacity: value });
      }
    }
    const [meetingRooms, total] = await queryBuilder
      .skip((pageNo - 1) * pageSize)
      .leftJoinAndSelect('meetingRoom.equipment', 'equipment')
      .take(pageSize)
      .getManyAndCount();
    return {
      data: meetingRooms,
      total,
    };
  }

  async bookingList(searchMeetingRoomDto: BookingMeetingRoomDto) {
    const { pageNo, pageSize, name, location, capacity, date } = searchMeetingRoomDto;
    const startTime = dayjs(date).startOf('day').toDate();
    const endTime = dayjs(date).endOf('day').toDate();

    const queryBuilder = this.meetingRoomRepository
      .createQueryBuilder('meetingRoom')
      .leftJoinAndSelect('meetingRoom.equipment', 'equipment')
      .leftJoinAndSelect(
        'meetingRoom.bookings',
        'bookings',
        '(bookings.startTime BETWEEN :startTime AND :endTime OR bookings.endTime BETWEEN :startTime AND :endTime OR (bookings.startTime <= :startTime AND bookings.endTime >= :endTime)) AND bookings.status = :bookingStatus',
        { startTime, endTime, bookingStatus: BookingStatus.DOING },
      )
      .where('meetingRoom.status = :roomStatus', { roomStatus: MeetingRoomStatus.FREE });

    if (name) {
      queryBuilder.andWhere('meetingRoom.name LIKE :name', { name: `%${name}%` });
    }
    if (location) {
      queryBuilder.andWhere('meetingRoom.location LIKE :location', { location: `%${location}%` });
    }

    if (capacity?.expression && capacity?.value !== undefined) {
      const { expression, value } = capacity;
      if (expression === Expression.BETWEEN) {
        queryBuilder.andWhere('meetingRoom.capacity BETWEEN :minCap AND :maxCap', {
          minCap: value[0] as number,
          maxCap: value[1] as number,
        });
      } else {
        queryBuilder.andWhere(`meetingRoom.capacity ${expression} :capacity`, { capacity: value });
      }
    }

    queryBuilder.skip((pageNo - 1) * pageSize).take(pageSize);

    const [meetingRooms, total] = await queryBuilder.getManyAndCount();

    const newMeetingRooms = meetingRooms.map((meetingRoom) => {
      return {
        ...meetingRoom,
        bookings: meetingRoom.bookings.map((book) => {
          return {
            startTime: dayjs(book.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(book.endTime).format('YYYY-MM-DD HH:mm:ss'),
          };
        }),
      };
    });

    return {
      data: newMeetingRooms,
      total,
    };
  }

  async delete(id: number) {
    const findMeetingRoom = await this.meetingRoomRepository.findOne({ where: { id } });
    if (!findMeetingRoom) {
      throw new NotFoundException('会议室不存在');
    }
    const booking = findMeetingRoom.bookings.find((booking) => booking.status === BookingStatus.DOING);
    if (booking) {
      throw new BadRequestException('会议室已被占用');
    }
    await this.meetingRoomRepository.delete(id);
    // TODO: 删除会议室关联的设备,释放设备占用
    return '删除成功';
  }

  async deleteForce(id: number, user: JwtPayload) {
    const findMeetingRoom = await this.meetingRoomRepository.findOne({ where: { id } });
    if (!findMeetingRoom) {
      throw new NotFoundException('会议室不存在');
    }
    const booking = findMeetingRoom.bookings.find((booking) => booking.status === BookingStatus.DOING);
    if (booking) {
      await this.bookingRepository.update(booking.id, {
        status: BookingStatus.CANCELLED,
        cancelTime: new Date(),
        cancelUserId: user.id,
        cancelUserName: user.username,
        cancelReason: '会议室被删除,系统自动取消',
      });
    }
    await this.meetingRoomRepository.delete(id);
    return '删除成功';
  }
}
