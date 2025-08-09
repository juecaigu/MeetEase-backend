import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/common/utils';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
import { Permission } from 'src/permission/entities/permission.entity';
import { UserDetailVo } from './vo/user-detail.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Role } from 'src/role/entities/role.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @Inject(RedisService)
    private redisService: RedisService,
    @Inject(EmailService)
    private emailService: EmailService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  // 在用户注册时生成用户编码
  private generateUserCode(): string {
    const date = new Date();
    const dateStr =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return dateStr + randomNum;
  }

  private generateUserDetailVo(user: User) {
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.code = user.user_code;
    vo.email = user.email;
    vo.phone = user.phone;
    vo.nickName = user.nick_name;
    vo.status = user.status === 1;
    vo.roles = user.roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
    return vo;
  }

  async register(userRegisterDto: UserRegisterDto) {
    const { username, password, email, phone, nickName, avatar, captcha } = userRegisterDto;
    // 验证验证码
    const cacheCaptcha = await this.redisService.get(`captcha_${email}`);
    if (!cacheCaptcha) {
      throw new BadRequestException('验证码已过期');
    }
    if (cacheCaptcha !== captcha) {
      throw new BadRequestException('验证码错误');
    }
    const findUser = await this.userRepository.findOne({ where: { username } });
    if (findUser) {
      throw new BadRequestException('用户已被注册');
    }
    const salt = Math.random().toString(36).substring(2, 15);
    const passwordHash = md5(password + salt);
    const user = this.userRepository.create({
      username,
      password: passwordHash,
      email,
      phone,
      nick_name: nickName,
      avatar,
      salt,
      user_code: this.generateUserCode(),
    });
    await this.userRepository.save(user);
    await this.redisService.del(`captcha_${email}`);
    return '注册成功';
  }

  async sendCaptcha(email: string) {
    const captcha = Math.random().toString(36).substring(2, 15);
    await this.redisService.set(`captcha_${email}`, captcha, 60 * 5);
    await this.emailService.sendEmail(email, '验证码', `您的验证码是：${captcha}`);
    return '验证码已发送';
  }

  async login(userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }
    const passwordHash = md5(password + user.salt);
    if (passwordHash !== user.password) {
      throw new BadRequestException('用户名或密码错误');
    }
    if (user.status === 0) {
      throw new BadRequestException('用户已冻结');
    }
    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      code: user.user_code,
      email: user.email,
      phone: user.phone,
      nick_name: user.nick_name,
      avatar: user.avatar,
      created_time: user.create_time,
      updated_time: user.update_time,
      roles: user.roles,
      permissions: user.roles.reduce((acc: Permission[], role) => {
        if (Array.isArray(role.permissions)) {
          role.permissions.forEach((permission) => {
            if (!acc.find((p) => p.id === permission.id)) {
              acc.push(permission);
            }
          });
        }
        return acc;
      }, []),
    };
    vo.token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });
    vo.fresh_token = this.jwtService.sign({ id: user.id }, { expiresIn: '7d' });
    return vo;
  }

  async refreshToken(freshToken: string) {
    try {
      const user: { id: number } = this.jwtService.verify(freshToken);
      const userInfo = await this.userRepository.findOne({ where: { id: user.id }, relations: ['roles'] });
      if (!userInfo) {
        throw new UnauthorizedException('用户不存在');
      }
      const token = this.jwtService.sign({
        id: userInfo.id,
        username: userInfo.username,
        roles: userInfo.roles,
        permissions: [],
      });
      const fresh_token = this.jwtService.sign({ id: user.id }, { expiresIn: '7d' });
      return {
        token,
        fresh_token,
      };
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('token已失效，请重新登录！');
    }
  }

  async list(page: number, size: number, username: string, nickName: string, email: string, status: boolean) {
    const pageNum = Math.max(page, 1);
    const pageSize = Math.max(size, 10);
    const where: FindOptionsWhere<User> = {};
    if (username) {
      where.username = Like(`%${username}%`);
    }
    if (nickName) {
      where.nick_name = Like(`%${nickName}%`);
    }
    if (email) {
      where.email = Like(`%${email}%`);
    }
    if (status !== undefined) {
      where.status = status ? 1 : 0;
    }
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: ['roles'],
    });
    return { users: users.map((user) => this.generateUserDetailVo(user)), total };
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { id, oldPassword, newPassword, captcha } = updatePasswordDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    const cacheCaptcha = await this.redisService.get(`captcha_${user.email}`);
    if (!cacheCaptcha || cacheCaptcha !== captcha) {
      throw new BadRequestException('验证码错误');
    }
    const oldPasswordHash = md5(oldPassword + user.salt);
    if (oldPasswordHash !== user.password) {
      throw new BadRequestException('旧密码错误');
    }
    const newPasswordHash = md5(newPassword + user.salt);
    await this.userRepository.update(id, { password: newPasswordHash });
    await this.redisService.del(`captcha_${user.email}`);
    return '密码修改成功';
  }

  async updateInfo(updateUserInfoDto: UpdateUserInfoDto) {
    const { id, nickName, avatar, phone, email } = updateUserInfoDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    await this.userRepository.update(id, { nick_name: nickName, avatar, phone, email });
    return '信息修改成功';
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { id, roleIds } = assignRoleDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    const roles = await this.roleRepository.find({ where: { id: In(roleIds) } });
    user.roles = roles;
    await this.userRepository.save(user);
    return '角色分配成功';
  }

  async frozeUser(id: number, status: 0 | 1) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.status === status) {
      return '用户状态已为' + (status === 0 ? '冻结' : '解冻');
    }
    await this.userRepository.update(id, { status: status });
    return '操作成功';
  }
}
