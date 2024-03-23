import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { ConsoleLoggerService } from './consoleLogger.service';

@Module({
  providers: [Logger, ConsoleLoggerService],
  exports: [Logger],
})
export class LoggerModule {}
