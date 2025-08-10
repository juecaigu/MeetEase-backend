import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'role',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '是否为超级管理员角色',
    default: false,
  })
  admin: boolean;

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

  @Column({ comment: '更新时间', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @ManyToMany(() => Permission, { cascade: true })
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

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
