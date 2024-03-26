import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogQueryMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LogQueryMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { url, params, body, headers } = req;
    const { statusCode } = res;
    this.logger.debug({
      url,
      params,
      body,
      statusCode,
      authorization: headers['authorization'],
    });
    next();
  }
}
