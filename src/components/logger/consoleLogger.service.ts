import { Injectable } from '@nestjs/common';
import { FileLoggerParams } from './logger.interface';
import { isObject } from 'class-validator';

@Injectable()
export class ConsoleLoggerService {
  log({ date, message, ttyColorCode }: FileLoggerParams) {
    if (isObject(message)) {
      console.log(`[${date}] - \x1b[${ttyColorCode}mobject:\x1b[0m`);
      console.log(message);
    } else {
      console.log(`[${date}] - \x1b[${ttyColorCode}m${message}\x1b[0m`);
    }
    // TODO: process.stdout don't show on TTY
    // process.stdout.write(
    //   `[${date}] - \x1b[${ttyColorCode}m${message}\x1b[0m`,
    // );
  }
}
