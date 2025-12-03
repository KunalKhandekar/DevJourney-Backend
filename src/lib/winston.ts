/**
 * Node modules
 */
import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

/**
 * Custom modules
 */
import config from '@/config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// Create a logtail transport instance
const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
  endpoint: `https://${config.LOGTAIL_INGESTING_HOST}`
})

if(config.NODE_ENV === "production") {
  if(!config.LOGTAIL_SOURCE_TOKEN || !config.LOGTAIL_INGESTING_HOST) {
    throw new Error('Logtail source token and ingesting host must be provided in the configuration');
  }

  transports.push(new LogtailTransport(logtail))
}

// If the application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Add colors to log levels
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // Add timestamps
        align(), // Align log messages
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// Logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info', // set the default log level to `info`.
  format: combine(
    errors({
      stack: true,
    }),
    timestamp(),
    json(), // Use the JSON format for log messages
  ),
  transports,
});

export { logger, logtail }