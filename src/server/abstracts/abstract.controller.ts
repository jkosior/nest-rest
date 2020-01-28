import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { logger } from '@server/logger';

export abstract class AbstractController {
  protected handleError(err: any, status: number = 500) {
    logger.error(err);
    switch (status) {
      case 404: throw new NotFoundException(err.message, err);
      case 500: throw new InternalServerErrorException(err.message, err);
    }
  }
}