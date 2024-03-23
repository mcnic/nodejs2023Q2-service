import { Injectable, LoggerService } from '@nestjs/common';
import { ConsoleLoggerService } from './consoleLogger.service';
import { FileLoggerService } from './fileLogger.service';
import { LogLevel } from './logger.interface';
@Injectable()
export class Logger implements LoggerService {
  level: number;
  locale: string;
  timeZone: string;
  consoleLog: boolean;
  fileLog: boolean;
  fileLogger: FileLoggerService;

  constructor(private readonly consoleLogger: ConsoleLoggerService) {
    this.level = parseInt(process.env.LOG_LEVEL);
    if (Number.isNaN(this.level)) this.level = 2;

    this.locale = process.env.LOCALE || 'en-US';
    this.timeZone = process.env.TIME_ZONE || 'UTC';

    this.consoleLog = Boolean(process.env.LOG_TO_CONSOLE) || false;
    this.fileLog = Boolean(process.env.LOG_TO_FILE) || false;

    if (this.fileLog) {
      const pathLogFile = process.env.LOG_FILE_PATH || '/var/log/nest-logs.log';
      const pathErrorFile =
        process.env.ERROR_FILE_PATH || '/var/log/nest-errors.log';
      const logFileSizeLimit = parseInt(process.env.LOG_FILE_MAX_SIZE) || 1;
      this.fileLogger = new FileLoggerService(
        pathLogFile,
        pathErrorFile,
        logFileSizeLimit,
      );
    }
  }

  error(message: string | JSON) {
    this.doLog(0, message, 31);
  }

  warn(message: string | JSON) {
    this.doLog(1, message, 33);
  }

  log(message: string | JSON) {
    this.doLog(2, message, 32);
  }

  debug?(message: string | JSON) {
    this.doLog(3, message, 94);
  }

  verbose?(message: string | JSON) {
    this.doLog(4, message, 95);
  }

  async doLog(level: LogLevel, message: string | JSON, ttyColorCode = 33) {
    if (level > this.level) return;

    const date = new Date().toLocaleTimeString(this.locale, {
      timeZone: this.timeZone,
    });

    if (this.consoleLog) {
      this.consoleLogger.log({ level, date, message, ttyColorCode });
    }

    if (this.fileLog) {
      await this.fileLogger.log({ level, date, message }, level !== 0);
    }
  }
}
