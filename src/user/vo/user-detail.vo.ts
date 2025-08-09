export class UserDetailVo {
  id: number;
  username: string;
  code: string;
  email: string;
  phone: string;
  nickName: string;
  avatar: string;
  status: boolean;
  roles: {
    id: number;
    name: string;
  }[];
}
