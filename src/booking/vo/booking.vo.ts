import { BookingStatus } from '../type';
import { AttendeesVo } from './attendees.vo';

export class BookingVo {
  id: number;
  startTime: Date;
  endTime: Date;
  userName: string;
  userCode: string;
  status: BookingStatus;
  meetingRoomId: number;
  attendees?: AttendeesVo[];
  meetingRoomName?: string;
  meetingRoomCode?: string;
  meetingRoomLocation?: string;
  remark?: string;
  cancelTime?: Date;
  cancelReason?: string;
  cancelUserId?: number;
  cancelUserName?: string;
}
