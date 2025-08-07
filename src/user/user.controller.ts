import { Body, Controller, Get, ParseBoolPipe, ParseIntPipe, Post, Query, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

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

  @SetMetadata('requireLogin', true)
  @Post('update/password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @SetMetadata('requireLogin', true)
  @Post('update/detail')
  updateInfo(@Body() updateInfoDto: UpdateUserInfoDto) {
    return this.userService.updateInfo(updateInfoDto);
  }

  @SetMetadata('requireLogin', true)
  @SetMetadata('requirePermission', ['user:assignRole'])
  @Post('assign/role')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.userService.assignRole(assignRoleDto);
  }

  @SetMetadata('requireLogin', true)
  @SetMetadata('requirePermission', ['user:froze'])
  @Get('froze')
  frozeUser(@Query('id', ParseIntPipe) id: number, @Query('status', ParseBoolPipe) status: boolean) {
    return this.userService.frozeUser(id, status ? 0 : 1);
  }
}
