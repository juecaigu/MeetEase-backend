import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { UserRegisterDto } from './user-register.dto';

export class UpdateUserInfoDto extends PartialType(UserRegisterDto) {
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsNumber({}, { message: '用户ID必须是数字' })
  id: number;
}
