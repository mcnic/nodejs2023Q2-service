import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TranformUsers<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) =>
        data.map((track) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, createdAt, updatedAt, ...fields } = track;
          return {
            ...fields,
            createdAt: createdAt.getTime(),
            updatedAt: updatedAt.getTime(),
          };
        }),
      ),
    );
  }
}

@Injectable()
export class TranformUser<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, createdAt, updatedAt, ...fields } = data;
        return {
          ...fields,
          createdAt: createdAt.getTime(),
          updatedAt: updatedAt.getTime(),
        };
      }),
    );
  }
}
