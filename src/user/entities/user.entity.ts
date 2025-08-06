import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({
    length: 12,
    comment: '用户编码',
    unique: true,
  })
  user_code: string;

  @Column({
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '昵称',
  })
  nick_name: string;

  @Column({
    comment: '邮箱',
  })
  email: string;

  @Column({
    comment: '手机号',
  })
  phone: string;

  @Column({
    comment: '头像',
  })
  avatar: string;

  @Column({
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_time: Date;

  @Column({
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  update_time: Date;

  @Column({
    comment: '状态',
    default: 1, // 1: 正常, 0: 禁用
  })
  status: number;

  @Column({
    comment: '盐',
  })
  salt: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
