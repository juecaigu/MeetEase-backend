import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingStatus } from '../type';
import { Attendees } from './attendees.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', comment: '开始时间', precision: 0 })
  startTime: Date;

  @Column({ type: 'datetime', comment: '结束时间', precision: 0 })
  endTime: Date;

  @Column({ type: 'datetime', comment: '创建时间', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'int', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', length: 255, comment: '用户名' })
  userName: string;

  @Column({ type: 'varchar', length: 255, comment: '用户编码' })
  userCode: string;

  @Column({ type: 'varchar', length: 255, comment: '用户电话' })
  userPhone?: string;

  @Column({ type: 'varchar', length: 255, comment: '用户昵称', nullable: true, default: '' })
  userNickname?: string;

  @ManyToOne(() => MeetingRoom, (meetingRoom) => meetingRoom.bookings)
  @JoinColumn({ name: 'meetingRoomId' })
  meetingRoomId: MeetingRoom;

  // @Column({ type: 'varchar', length: 255, comment: '会议室编码' })
  // meetingRoomCode: string;

  // @Column({ type: 'varchar', length: 255, comment: '会议室名称' })
  // meetingRoomName?: string;

  // @Column({ type: 'varchar', length: 255, comment: '会议室位置' })
  // meetingRoomLocation?: string;

  @Column({ type: 'int', comment: '状态', default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @Column({ type: 'varchar', length: 255, comment: '备注', nullable: true })
  remark?: string;

  // 被取消的时候需要填写取消时间,取消原因,取消用户ID,取消用户名
  @Column({ type: 'datetime', comment: '取消时间', nullable: true })
  cancelTime?: Date;

  @Column({ type: 'varchar', length: 255, comment: '取消原因', nullable: true })
  cancelReason?: string;

  @Column({ type: 'int', comment: '取消用户ID', nullable: true })
  cancelUserId?: number;

  @Column({ type: 'varchar', length: 255, comment: '取消用户名', nullable: true })
  cancelUserName?: string;

  // 会议室参会人员
  @OneToMany(() => Attendees, (attendees) => attendees.booking, { cascade: true })
  attendees?: Attendees[];
}
