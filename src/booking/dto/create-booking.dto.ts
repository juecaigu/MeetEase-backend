import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Attendees } from '../entities/attendees.entity';

export class CreateBookingDto {
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsDateString({}, { message: '开始时间必须为有效的日期字符串' })
  startTime: string;

  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsDateString({}, { message: '结束时间必须为有效的日期字符串' })
  endTime: string;

  @IsOptional()
  @IsString({ message: '会议室编码必须为字符串' })
  meetingRoomCode?: string;

  @IsNotEmpty({ message: '会议室名称不能为空' })
  @IsString({ message: '会议室名称必须为字符串' })
  meetingRoomName: string;

  @IsOptional()
  @IsString({ message: '会议室位置必须为字符串' })
  meetingRoomLocation?: string;

  @IsNotEmpty({ message: '会议室ID不能为空' })
  @IsNumber({}, { message: '会议室ID必须为数字' })
  meetingRoomId: number;

  @IsOptional()
  @IsArray({ message: '参会人员必须为数组' })
  attendees: Attendees[];

  @IsOptional()
  @IsString({ message: '备注必须为字符串' })
  remark?: string;
}
