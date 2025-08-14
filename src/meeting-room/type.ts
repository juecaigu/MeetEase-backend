import { Expression } from 'src/type/type';

export enum MeetingRoomStatus {
  UNAVAILABLE = 0,
  FREE = 1,
  MAINTENANCE = 2,
  PREPARING = 3,
}

export interface Capacity {
  expression: Expression;
  value: Expression extends Expression.BETWEEN ? number[] : number;
}
