import { createLogger, format, transports } from 'winston';
import { StreamOptions } from 'morgan';

const options = {
  file: {
    level: 'info',
    filename: `./logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(format.colorize(), format.simple()),
  },
};

const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, stream };
