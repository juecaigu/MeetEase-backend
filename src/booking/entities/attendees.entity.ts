import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Attendees {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.attendees)
  booking: Booking;

  @Column({ type: 'int', comment: '用户ID', nullable: true })
  user_id?: number;

  @Column({ type: 'varchar', length: 255, comment: '用户编码', nullable: true })
  user_code?: string;

  @Column({ type: 'varchar', length: 255, comment: '参会人员姓名', nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, comment: '参会人员电话', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, comment: '参会人员邮箱', nullable: true })
  email?: string;
}
