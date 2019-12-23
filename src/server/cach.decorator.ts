import { LogLevel } from './log-levels';
import { logger } from './logger/index';

interface Catcher {
  rethrow?: boolean;
}

const catchExecutor = (level: LogLevel, options: Catcher) =>
  (target: object, key: string, desctiptor: PropertyDescriptor) => {
    const originalMethod = desctiptor.value;

    desctiptor.value = function(...args) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        const originalMessage = error.message;

        handleErrorLevel(
          level,
          errorName(target.constructor.name, originalMessage),
        );

        if (options.rethrow) {
          throw error;
        }
      }
    };

    return desctiptor;
  };

const handleErrorLevel = (level: LogLevel, error: string) => {
  switch (level) {
    case LogLevel.Error:
      return logger.error(error);
    case LogLevel.Critical:
      return logger.crit(error);
  }
};

const errorName = (title: string, subtitle: string) => `${title} - ${subtitle}`;

export const Catch = (level: LogLevel = LogLevel.Error, options: Catcher = { rethrow: false }) => {
  return catchExecutor(level, options);
};

export const CatchCritical = () => Catch(LogLevel.Critical);
