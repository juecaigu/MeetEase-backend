import { Controller, Post, Body, SetMetadata, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Request } from 'express';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { ListBookingDto } from './dto/list-booking.dto';

// @SetMetadata('permission', 'booking')
@SetMetadata('requireLogin', true)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.create(createBookingDto, req.user);
  }

  @Post('cancel')
  cancel(@Body() cancelBookingDto: CancelBookingDto, @Req() req: Request) {
    return this.bookingService.cancel(cancelBookingDto, req.user);
  }

  @Post('list')
  list(@Body() listBookingDto: ListBookingDto) {
    return this.bookingService.list(listBookingDto);
  }
}
