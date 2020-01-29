import { RequestHandler } from '@nestjs/common/interfaces';
import * as morgan from 'morgan';
import { logger } from './index';
import { morganFormat } from './formats';

const morganSkip = (req, res): boolean =>
  process.env.NODE_ENV === 'production' ? false : res.statusCode < 400;

class MorganStream implements morgan.StreamOptions {
  write(text: string) {
    text = text.trim();
    const statusCode = this.getStatusCode(text);

    if (statusCode === -1) {
      return;
    }

    return logger.error(text);
  }

  private getStatusCode(text: string): number {
    const statusCode: RegExpMatchArray | null = text.match(/\d{3}/);
    if (statusCode === null) {
      return -1;
    }

    const code: number = parseInt(statusCode[0], 10);
    if (isNaN(code)) {
      return -1;
    }

    return code;
  }
}

const morganStream: MorganStream = new MorganStream();
const morganOptions: morgan.Options & { noColor: boolean } = {
  noColor: true, // prevents color codes in files
  skip: morganSkip,
  stream: morganStream,
};

export const morganInstance: RequestHandler = morgan(
  morganFormat,
  morganOptions,
);
