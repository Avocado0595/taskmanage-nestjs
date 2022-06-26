import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transfrom.interceptor';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin:["http://localhost:5000"]});
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(5001);
}
bootstrap();
