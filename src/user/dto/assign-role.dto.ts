import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsNumber({}, { message: '用户ID必须是数字' })
  id: number;

  @IsNotEmpty({ message: '角色ID不能为空' })
  @IsArray({ message: '角色ID必须是数组' })
  roleIds: number[];
}
