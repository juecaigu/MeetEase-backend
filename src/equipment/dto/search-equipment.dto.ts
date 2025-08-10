import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PurchaseDate, RemainingQuantity, Status } from '../type';

export class SearchEquipmentDto {
  @IsNotEmpty()
  @IsNumber()
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  status: Status;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  price: RemainingQuantity;

  @IsOptional()
  remainingQuantity: RemainingQuantity;

  @IsOptional()
  purchaseDate: PurchaseDate;
}
