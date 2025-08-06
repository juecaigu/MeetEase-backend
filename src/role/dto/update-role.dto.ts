import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNumber({}, { message: '角色ID必须是数字' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  id: number;

  @IsArray({ message: '权限ID必须是数组' })
  permissions: number[];
}
