import { createLogger, format, Logger, transports } from 'winston';
import { myConsoleFormat, myFileFormat } from './formats';
import { morganInstance } from './morgan';
import { NestExpressApplication } from '@nestjs/platform-express';

export const logger: Logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), myConsoleFormat),
    }),
    new transports.File({
      filename: process.env.ERROR_LOG_FILE || 'error.log',
      format: format.combine(format.timestamp(), myFileFormat),
      level: 'error',
      maxsize: 10000,
    }),
  ],
});

export function useMorgan(app: NestExpressApplication) {
  app.use(morganInstance);
}
