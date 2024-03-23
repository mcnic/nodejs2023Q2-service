import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'src/components/logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();

    const resp = exception.getResponse();
    const respRecord: Record<string, any> =
      typeof resp === 'string' ? {} : resp;
    let message = respRecord.message;

    if (!(exception instanceof HttpException)) {
      status = 500;
      message = 'Internal Server Error';
    }

    this.logger.error(`HTTP Error ${message} (${status})`);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
