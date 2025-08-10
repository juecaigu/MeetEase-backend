export enum Expression {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  BETWEEN = 'BETWEEN',
}

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
