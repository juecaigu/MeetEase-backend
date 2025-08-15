import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomExpectionFilter } from './common/custom-expection.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new CustomExpectionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)));
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });
  await app.listen(configService.get<number>('PORT') ?? 3000);
}

bootstrap();
