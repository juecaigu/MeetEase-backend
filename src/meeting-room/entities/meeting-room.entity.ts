import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { MeetingRoomStatus } from '../type';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '会议室编号', unique: true })
  code: string;

  @Column({ comment: '会议室名称' })
  name: string;

  @Column({ comment: '会议室描述', nullable: true })
  description: string;

  @Column({ comment: '会议室位置' })
  location: string;

  @Column({ comment: '会议室状态,0-不可用,1-可用,2-维护中,3-准备中', default: 1 })
  status: MeetingRoomStatus;

  @Column({ comment: '会议室容量' })
  capacity: number;

  @ManyToMany(() => Equipment, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'meeting_room_equipment',
    joinColumn: {
      name: 'meeting_room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'id',
    },
  })
  equipment: Equipment[];

  @OneToMany(() => Booking, (booking) => booking.meetingRoomId, { cascade: true })
  bookings: Booking[];

  @Column({ comment: '会议室图片', nullable: true })
  image: string;

  @Column({ comment: '创建时间', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ comment: '更新时间', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;
}
