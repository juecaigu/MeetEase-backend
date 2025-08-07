import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber, MaxLength, Length, Matches } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度不能小于3且不能大于50' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: '密码必须包含至少8个字符，包括至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
  })
  @MaxLength(50, { message: '密码长度不能大于50' })
  password: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  @IsPhoneNumber('CN', { message: '手机号格式不正确' })
  phone: string;

  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称必须是字符串' })
  @Length(2, 50, { message: '昵称长度不能小于2且不能大于50' })
  nickName: string;

  @IsString({ message: '头像必须是字符串' })
  avatar: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
