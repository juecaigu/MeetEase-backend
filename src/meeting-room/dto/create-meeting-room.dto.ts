import { ArrayContains, IsArray, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateMeetingRoomDto {
  @IsNotEmpty({ message: '会议室编号不能为空' })
  @IsString({ message: '会议室编号必须为字符串' })
  code: string;

  @IsNotEmpty({ message: '会议室名称不能为空' })
  @IsString({ message: '会议室名称必须为字符串' })
  @MaxLength(20, { message: '会议室名称不能超过20个字符' })
  name: string;

  @IsString({ message: '会议室描述必须为字符串' })
  @MaxLength(200, { message: '会议室描述不能超过200个字符' })
  description: string;

  status: number;

  @IsNotEmpty({ message: '会议室容量不能为空' })
  @IsNumber({}, { message: '会议室容量必须为数字' })
  capacity: number;

  @IsArray({ message: '会议室设备必须为数组' })
  @ArrayContains([], { message: '会议室设备必须为投影仪、白板、音响、话筒' })
  equipment: string[];
}
