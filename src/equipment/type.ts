import { Expression } from 'src/type/type';

export enum Status {
  AVAILABLE = 1, // 可用
  UNAVAILABLE = 0, // 不可用
  IN_USE = 2, // 使用中
}

export interface RemainingQuantity {
  expression: Expression;
  value: Expression extends Expression.BETWEEN ? number[] : number;
}

export interface PurchaseDate {
  expression: Expression;
  value: Expression extends Expression.BETWEEN ? Date[] : Date;
}
