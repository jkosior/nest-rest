import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { logger } from './logger';

export function addSwagger(app: NestExpressApplication) {
  const apiPath = '/api';
  const isDev = process.env.NODE_ENV !== 'production';
  const hostDomain = process.env.API_URL || 'localhost:3000';

  const options = new DocumentBuilder()
    .setTitle('Nest rest api')
    .setDescription('Test API')
    .setVersion('1.0')
    .addTag('Cart')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  if (!isDev) {
    logger.warn('Not development environment - swagger documentation not available');
  } else {
    SwaggerModule.setup(apiPath, app, document);
  }
}
