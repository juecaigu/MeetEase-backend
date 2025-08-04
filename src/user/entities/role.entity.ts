import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'role',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '角色名称',
  })
  name: string;

  @Column({
    comment: '角色描述',
  })
  description: string;

  @Column({
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_time: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];
}
