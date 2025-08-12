import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingStatus } from '../type';
import { Attendees } from './attendees.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', comment: '开始时间', precision: 0, nullable: false })
  start_time: Date;

  @Column({ type: 'datetime', comment: '结束时间', precision: 0, nullable: false })
  end_time: Date;

  @Column({ type: 'datetime', comment: '创建时间', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'int', comment: '用户ID' })
  user_id: number;

  @Column({ type: 'varchar', length: 255, comment: '用户名' })
  user_name: string;

  @Column({ type: 'varchar', length: 255, comment: '用户编码' })
  user_code: string;

  @Column({ type: 'varchar', length: 255, comment: '用户电话' })
  user_phone?: string;

  @Column({ type: 'int', comment: '会议室ID' })
  meeting_room_id: number;

  @Column({ type: 'varchar', length: 255, comment: '会议室编码' })
  meeting_room_code: string;

  @Column({ type: 'varchar', length: 255, comment: '会议室名称' })
  meeting_room_name?: string;

  @Column({ type: 'varchar', length: 255, comment: '会议室位置' })
  meeting_room_location?: string;

  @Column({ type: 'int', comment: '状态', default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @Column({ type: 'varchar', length: 255, comment: '备注', nullable: true })
  remark?: string;

  // 被取消的时候需要填写取消时间,取消原因,取消用户ID,取消用户名
  @Column({ type: 'datetime', comment: '取消时间', nullable: true })
  cancel_time?: Date;

  @Column({ type: 'varchar', length: 255, comment: '取消原因', nullable: true })
  cancel_reason?: string;

  @Column({ type: 'int', comment: '取消用户ID', nullable: true })
  cancel_user_id?: number;

  @Column({ type: 'varchar', length: 255, comment: '取消用户名', nullable: true })
  cancel_username?: string;

  @Column({ type: 'varchar', length: 255, comment: '取消用户电话', nullable: true })
  cancel_user_phone?: string;

  // 会议室参会人员
  @OneToMany(() => Attendees, (attendees) => attendees.booking, { cascade: true })
  attendees?: Attendees[];
}
