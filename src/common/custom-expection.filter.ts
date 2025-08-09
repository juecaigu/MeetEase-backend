import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExpectionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as { message: string[] | string };
    const data = Array.isArray(res?.message) ? res?.message.join(',') : res?.message;
    console.log('res', res);
    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: data || exception.message,
      })
      .end();
  }
}
