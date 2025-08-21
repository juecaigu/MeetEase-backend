import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request } from 'express';
import { getReqMainInfo } from './utils';

@Catch(HttpException)
export class CustomExpectionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as { message: string[] | string };
    const req = ctx.getRequest<Request>();
    const data = Array.isArray(res?.message) ? res?.message.join(',') : res?.message;
    const message = data || exception.message;
    this.logger.error(message, {
      code: exception.getStatus(),
      req: getReqMainInfo(req),
    });
    response
      .json({
        code: exception.getStatus(),
        message: message,
        data: null,
      })
      .end();
  }
}
