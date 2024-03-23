import { Injectable, LoggerService } from '@nestjs/common';
import { isObject } from 'class-validator';

/* const level = {
  0: 'error',
  1: 'warn',
  2: 'log',
  3: 'debug',
  4: 'verbose',
}; */

@Injectable()
export class MyLogger implements LoggerService {
  level: number;
  locale: string;
  timeZone: string;

  constructor() {
    this.level = parseInt(process.env.LOG_LEVEL);
    if (Number.isNaN(this.level)) this.level = 2;

    this.locale = process.env.LOCALE || 'en-US';
    this.timeZone = process.env.TIME_ZONE || 'UTC';
  }

  error(message: string | JSON) {
    this.makeLogProc(0, message, 31);
  }

  warn(message: string | JSON) {
    this.makeLogProc(1, message, 33);
  }

  log(message: string | JSON) {
    this.makeLogProc(2, message, 32);
  }

  debug?(message: string | JSON) {
    this.makeLogProc(3, message, 94);
  }

  verbose?(message: string | JSON) {
    this.makeLogProc(4, message, 95);
  }

  fatal(message: string | JSON) {
    this.makeLogProc(0, message, 91);
  }

  makeLogProc(level: number, message: string | JSON, start = 33) {
    if (level > this.level) return;

    const date = new Date().toLocaleTimeString(this.locale, {
      timeZone: this.timeZone,
    });

    if (isObject(message)) {
      console.log(`[${date}] - \x1b[${start}mobject:\x1b[0m`);
      console.log(message);
    } else {
      console.log(`[${date}] - \x1b[${start}m${message}\x1b[0m`);
    }
  }
}
