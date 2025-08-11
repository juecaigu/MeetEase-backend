import { Expression } from 'src/type/type';

export enum Status {
  FREE = 0,
  USING = 1,
  MAINTENANCE = 2,
}

export interface Capacity {
  expression: Expression;
  value: Expression extends Expression.BETWEEN ? number[] : number;
}
