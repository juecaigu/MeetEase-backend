import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'permission',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;

  @Column({
    comment: '权限描述',
  })
  description: string;
}
