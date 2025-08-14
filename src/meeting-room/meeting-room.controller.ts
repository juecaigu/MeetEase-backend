import { Controller, Post, Body, Get, Query, ParseIntPipe, ParseEnumPipe, Req } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { SetMetadata } from '@nestjs/common';
import { SearchMeetingRoomDto } from './dto/search-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomStatus } from './type';
import { Request } from 'express';

@SetMetadata('requireLogin', true)
@SetMetadata('requirePermission', ['meeting-room'])
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create')
  create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(createMeetingRoomDto);
  }

  @Post('update')
  update(@Body() updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return this.meetingRoomService.update(updateMeetingRoomDto);
  }

  @Post('update/equipment')
  updateEquipment(@Body() updateMeetingRoomDto: { id: number; equipment: number[] }) {
    return this.meetingRoomService.updateEquipment(updateMeetingRoomDto);
  }

  @Get('update/status')
  updateStatus(
    @Query('id', ParseIntPipe) id: number,
    @Query('status', new ParseEnumPipe(MeetingRoomStatus)) status: MeetingRoomStatus,
  ) {
    return this.meetingRoomService.updateStatus({ id, status });
  }

  @Post('list')
  list(@Body() listMeetingRoomDto: SearchMeetingRoomDto) {
    return this.meetingRoomService.list(listMeetingRoomDto);
  }

  @Get('delete')
  delete(@Query('id', ParseIntPipe) id: number) {
    return this.meetingRoomService.delete(id);
  }

  @Get('delete/force')
  deleteForce(@Query('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.meetingRoomService.deleteForce(id, req.user);
  }
}
