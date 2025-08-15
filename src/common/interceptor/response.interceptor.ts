import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getReqMainInfo } from '../utils';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request } from 'express';

export interface Response<T> {
  code: number;
  message: string;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const result = next.handle().pipe(
      map((data: T) => {
        return {
          code: 200,
          message: 'success',
          data,
        };
      }),
    );
    const req = context.switchToHttp().getRequest<Request>();
    try {
      this.logger.log(JSON.stringify(result), {
        status: 200,
        message: 'response',
        req: getReqMainInfo(req),
      });
    } catch (error) {
      console.log('error', error);
    }

    return result;
  }
}
