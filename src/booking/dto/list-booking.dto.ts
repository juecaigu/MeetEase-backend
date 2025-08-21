import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../type';

export class ListBookingDto {
  @IsNotEmpty()
  @IsNumber()
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsEnum(BookingStatus, { message: '状态不正确' })
  status: BookingStatus;

  @IsOptional()
  @IsDateString({}, { message: '开始时间必须为有效的日期字符串' })
  startTime: string;

  @IsOptional()
  @IsDateString({}, { message: '结束时间必须为有效的日期字符串' })
  endTime: string;

  @IsOptional()
  @IsString()
  userName: string;
}
