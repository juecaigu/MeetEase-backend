import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.register(userRegisterDto);
  }

  @Get('captcha')
  sendCaptcha(@Query('email') email: string) {
    return this.userService.sendCaptcha(email);
  }
}
