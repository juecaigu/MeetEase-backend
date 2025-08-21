import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';

interface UserInfo {
  id: number;
  username: string;
  code: string;
  email: string;
  phone: string;
  nickname: string;
  avatar: string;
  createdTime: Date;
  updatedTime: Date;
  roles: Role[];
  permissions: Permission[];
}

export class LoginUserVo {
  userInfo: UserInfo;
  token: string;
  fresh_token: string;
}
