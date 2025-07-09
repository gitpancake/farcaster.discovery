import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    isProd
      ? winston.format.json()
      : winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
          return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
        })
  ),
  transports: [new winston.transports.Console()],
});

export class Logger {
  static info(message: string, data?: any) {
    logger.info(message, data ? { data } : undefined);
  }
  static warn(message: string, data?: any) {
    logger.warn(message, data ? { data } : undefined);
  }
  static error(message: string, data?: any) {
    logger.error(message, data ? { data } : undefined);
  }
  static debug(message: string, data?: any) {
    logger.debug(message, data ? { data } : undefined);
  }
}
