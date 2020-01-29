import { Format } from 'logform';
import { format } from 'winston';

export const myFileFormat: Format = format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} -- ${level}: ${message}`;
  },
);

export const myConsoleFormat: Format = format.printf(({ level, message }) => {
  return `${level}: ${message}`;
});

export const morganFormat: string = ':method :url :status :response-time ms';
