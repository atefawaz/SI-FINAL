import { createLogger, format, transports } from 'winston';
import { Writable } from 'stream';

// Define the custom settings for each transport
const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    handleExceptions: true,
    maxsize: 5242880, // about 5MB
    maxFiles: 5,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(format.colorize(), format.simple()),
  },
};

// Instantiate a new Winston Logger with the options defined above
const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

// Create a stream object with a 'write' function
const stream = new Writable({
  write: (message: string, _encoding, callback) => {
    logger.info(message.trim());
    callback();
  },
});

// Extend the logger to include the stream property
(logger as any).stream = stream;

export default logger;
