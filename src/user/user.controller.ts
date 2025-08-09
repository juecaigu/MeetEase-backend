import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { storage } from 'src/common/upload.storage';

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
  list(
    @Query('pageNo', ParseIntPipe) pageNo: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
    @Query('status') status: boolean,
  ) {
    return this.userService.list(pageNo, pageSize, username, nickName, email, status);
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
    return this.userService.frozeUser(id, status ? 1 : 0);
  }

  @SetMetadata('requireLogin', true)
  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/avatar',
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
      storage: storage('uploads/avatar'),
      fileFilter: (req, file, cb) => {
        if (['.png', '.jpg', '.jpeg'].includes(path.extname(file.originalname).toLowerCase())) {
          cb(null, true);
        } else {
          cb(new BadRequestException('只能上传png、jpg、jpeg图片'), false);
        }
      },
    }),
  )
  uploadAvatar(@UploadedFile('file', ParseFilePipe) file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('上传失败');
    }

    return `uploads/avatar/${file.filename}`;
  }
}
