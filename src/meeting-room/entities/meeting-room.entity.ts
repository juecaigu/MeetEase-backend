import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Equipment } from 'src/equipment/entities/equipment.entity';

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

  @Column({ comment: '会议室状态,0:空闲,1:使用中,2:维护中', default: 0 })
  status: number;

  @Column({ comment: '会议室容量' })
  capacity: number;

  @ManyToMany(() => Equipment)
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

  @Column({ comment: '会议室图片', nullable: true })
  image: string;

  @Column({ comment: '创建时间', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ comment: '更新时间', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
