import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsNumber({}, { message: '用户ID必须是数字' })
  id: number;

  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString({ message: '旧密码必须是字符串' })
  oldPassword: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: '新密码必须包含至少8个字符，包括至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
  })
  newPassword: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  captcha: string;
}
