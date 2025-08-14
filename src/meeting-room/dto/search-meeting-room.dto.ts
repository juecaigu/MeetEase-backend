import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Capacity, MeetingRoomStatus } from '../type';
import { IsExpressionObject } from 'src/decorators/is-expression-object.decorator';

export class SearchMeetingRoomDto {
  @IsNotEmpty()
  @IsNumber()
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  status: MeetingRoomStatus;

  @IsOptional()
  @IsExpressionObject()
  capacity: Capacity;
}
