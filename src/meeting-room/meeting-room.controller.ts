import { Controller, Post, Body } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { SetMetadata } from '@nestjs/common';
import { SearchMeetingRoomDto } from './dto/search-meeting-room.dto';

@SetMetadata('requireLogin', true)
@SetMetadata('requirePermission', ['meeting-room'])
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create')
  create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(createMeetingRoomDto);
  }

  @Post('list')
  list(@Body() listMeetingRoomDto: SearchMeetingRoomDto) {
    console.log('listMeetingRoomDto', listMeetingRoomDto);
    return this.meetingRoomService.list(listMeetingRoomDto);
  }
}
