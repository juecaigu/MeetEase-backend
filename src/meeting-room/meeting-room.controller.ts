import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create')
  create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(createMeetingRoomDto);
  }

  // @Get('list')
  // list() {
  //   return this.meetingRoomService.list();
  // }

  @Post('update')
  update(@Query('id', ParseIntPipe) id: number, @Body() updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return this.meetingRoomService.update(+id, updateMeetingRoomDto);
  }

  @Get('detail')
  remove(@Query('id', ParseIntPipe) id: number) {
    return this.meetingRoomService.remove(id);
  }
}
