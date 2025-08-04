import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/common/utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(RedisService)
    private redisService: RedisService,
    @Inject(EmailService)
    private emailService: EmailService,
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

  async register(userRegisterDto: UserRegisterDto) {
    const { username, password, email, phone, nick_name, avatar, captcha } = userRegisterDto;
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
      nick_name,
      avatar,
      salt,
      user_code: this.generateUserCode(),
    });
    await this.userRepository.save(user);
    return '注册成功';
  }

  async sendCaptcha(email: string) {
    const captcha = Math.random().toString(36).substring(2, 15);
    await this.redisService.set(`captcha_${email}`, captcha, 60 * 5);
    await this.emailService.sendEmail(email, '验证码', `您的验证码是：${captcha}`);
    return '验证码已发送';
  }
}
