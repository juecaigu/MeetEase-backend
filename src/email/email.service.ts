/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    try {
      this.transporter = createTransport({
        host: configService.get<string>('EMAIL_HOST'),
        port: configService.get<number>('EMAIL_PORT'),
        auth: {
          user: configService.get<string>('EMAIL_USER'),
          pass: configService.get<string>('EMAIL_PASS'),
        },
      });
    } catch (error) {
      console.error('failed to create transporter', error);
    }
  }

  async sendEmail(to: string, subject: string, text: string) {
    if (!this.transporter) {
      throw new Error('邮件传输器未正确初始化');
    }
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject,
      text,
    });
  }
}
