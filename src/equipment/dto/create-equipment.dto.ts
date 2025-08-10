import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from '../type';

export class CreateEquipmentDto {
  @IsNotEmpty({ message: '设备名称不能为空' })
  @IsString({ message: '设备名称必须为字符串' })
  @MaxLength(50, { message: '设备名称不能超过50个字符' })
  name: string;

  @IsNotEmpty({ message: '设备类型不能为空' })
  @IsString({ message: '设备类型必须为字符串' })
  @MaxLength(20, { message: '设备类型不能超过20个字符' })
  type: string;

  @IsString({ message: '设备描述必须为字符串' })
  @MaxLength(255, { message: '设备描述不能超过255个字符' })
  description: string;

  @IsNotEmpty({ message: '设备编号不能为空' })
  @IsString({ message: '设备编号必须为字符串' })
  @MaxLength(20, { message: '设备编号不能超过20个字符' })
  code: string;

  @IsOptional()
  @IsNumber({}, { message: '设备状态必须为数字' })
  status?: Status;

  @IsOptional()
  @IsNumber({}, { message: '设备价格必须为数字' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: '设备采购数量必须为数字' })
  quantity: number;

  @IsOptional()
  @IsNumber({}, { message: '设备剩余数量必须为数字' })
  remaining_quantity?: number;

  @IsOptional()
  @IsString({ message: '设备供应商必须为字符串' })
  @MaxLength(255, { message: '设备供应商不能超过255个字符' })
  supplier?: string;

  @IsOptional()
  @IsDateString({}, { message: '设备采购日期必须为日期' })
  purchase_date?: Date;
}
