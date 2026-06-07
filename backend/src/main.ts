import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendUrl = process.env.FRONTEND_URL?.trim().replace(/\/$/, '');
  app.enableCors({
    origin: [
      frontendUrl || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:8080',
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on port ${process.env.PORT || 3000}`);
  console.log(`CORS allowed origin: ${frontendUrl}`);
}
bootstrap();
