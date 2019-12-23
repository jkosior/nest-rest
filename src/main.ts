import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { addSwagger } from './server/add-swagger';
import { useMorgan } from './server/logger/index';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  addSwagger(app); // adds swagger documentation
  useMorgan(app); // enables morgan middleware
  await app.listen(process.env.PORT);
}

bootstrap();
