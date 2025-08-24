import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { BookingStatus } from '../type';

export class BookingVo {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  userName: string;
  userCode: string;
  status: BookingStatus;
  meetingRoom: MeetingRoom;
  remark?: string;
  cancelTime?: string;
  cancelReason?: string;
  cancelUserId?: number;
  cancelUserName?: string;
  createTime: string;
}
