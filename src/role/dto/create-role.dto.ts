import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: '角色名称必须是字符串' })
  @Length(1, 50, { message: '角色名称长度不能超过50个字符' })
  name: string;

  @IsString({ message: '角色描述必须是字符串' })
  @Length(1, 255, { message: '角色描述长度不能超过255个字符' })
  description: string;
}
