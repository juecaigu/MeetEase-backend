import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsExpressionObject } from 'src/decorators/is-expression-object.decorator';
import { Capacity } from '../type';

export class BookingMeetingRoomDto {
  @IsNotEmpty()
  @IsNumber()
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @IsDateString({}, { message: '日期必须为有效的日期字符串' })
  date: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsExpressionObject()
  capacity: Capacity;
}
