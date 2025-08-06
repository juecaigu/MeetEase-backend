import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';

interface UserInfo {
  id: number;
  username: string;
  code: string;
  email: string;
  phone: string;
  nick_name: string;
  avatar: string;
  created_time: Date;
  updated_time: Date;
  roles: Role[];
  permissions: Permission[];
}

export class LoginUserVo {
  userInfo: UserInfo;
  token: string;
  fresh_token: string;
}
