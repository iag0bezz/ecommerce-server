import winston from 'winston';

export class LogProvider {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.align(),
        winston.format.printf(info => {
          return `[${info.timestamp}] ${info.level}: ${info.message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  timer() {
    return this.logger.startTimer();
  }

  log(message: string, level = 'info') {
    this.logger.log(level, message);
  }
}
