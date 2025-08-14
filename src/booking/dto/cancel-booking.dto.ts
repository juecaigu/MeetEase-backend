import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CancelBookingDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  cancelReason: string;
}
