import { Body, Controller, Get, Post, Query, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

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

  @Post('login')
  login(@Body() loginDto: UserLoginDto) {
    return this.userService.login(loginDto);
  }

  @Get('refresh/token')
  refreshToken(@Query('refresh_token') refreshToken: string) {
    return this.userService.refreshToken(refreshToken);
  }

  @SetMetadata('requireLogin', true)
  @SetMetadata('requirePermission', ['user:list'])
  @Get('list')
  list(@Query('id') id: number) {
    return this.userService.list(id);
  }
}
