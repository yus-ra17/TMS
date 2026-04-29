import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:4173'] });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();
