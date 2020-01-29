import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { logger } from '@server/logger';

export abstract class AbstractController {
  protected handleError(err: any, status: number) {
    const statusToCheck = status || 500;
    logger.error(err.message);
    switch (statusToCheck) {
      case 400:
        throw new BadRequestException(err.message, err);
      case 404:
        throw new NotFoundException(err.message, err);
      case 500:
        throw new InternalServerErrorException(err.message, err);
    }
  }
}
