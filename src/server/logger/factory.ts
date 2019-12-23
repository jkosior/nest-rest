import { Logger } from 'winston';

export class LoggerFactory {
  private isSilent: boolean = process.env.NODE_ENV === 'test';

  constructor(private readonly loggerHandler: Logger) {}

  critical(message: string) {
    this.loggerHandler.crit(message);
  }
  error(message: string) {
    this.loggerHandler.error(message);
  }
  info(message: string) {
    this.loggerHandler.info(message);
  }
}
