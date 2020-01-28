import * as helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { logger } from './logger';

export const addHelmet = (app: NestExpressApplication) => {
  app.use(helmet());
  logger.info('Helmet started');
};
