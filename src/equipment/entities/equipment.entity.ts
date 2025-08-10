import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '设备编号', unique: true })
  code: string;

  @Column({ comment: '设备名称' })
  name: string;

  @Column({ comment: '设备描述' })
  description: string;

  @Column({ comment: '设备状态', default: 1 })
  status: number;

  // @Column({ comment: '设备图片' })
  // image: string;

  @Column({ comment: '价格' })
  price: number;

  @Column({ comment: '采购数量', default: 0, type: 'int' })
  quantity: number;

  @Column({ comment: '剩余数量', default: 0, type: 'int' })
  remaining_quantity: number;

  @Column({ comment: '设备类型' })
  type: string;

  @Column({ comment: '设备供应商' })
  supplier: string;

  @Column({ comment: '采购日期' })
  purchase_date: Date;
}
