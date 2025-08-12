import { Controller, Post, Body, SetMetadata, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Request } from 'express';

@SetMetadata('permission', 'booking')
@SetMetadata('requireLogin', true)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.create(createBookingDto, req.user);
  }
}
