import { Permission } from 'src/permission/entities/permission.entity';

export class RoleVo {
  id: number;
  name: string;
  description: string;
  admin: boolean;
  create_time: Date;
  permissions: Permission[];
}
