import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const remoreFavoriteFromObject = (obj: { favorite: boolean }): any => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { favorite, ...fields } = obj;
  return { ...fields };
};

const remoreFavoriteFromObjectsArray = (arr: { favorite: boolean }[]): any => {
  return arr.map((item) => remoreFavoriteFromObject(item));
};

export interface Response<T> {
  data: T;
}

@Injectable()
export class RemoveFavoriteFromArray<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((data) => remoreFavoriteFromObjectsArray(data)));
  }
}

@Injectable()
export class RemoveFavorite<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => remoreFavoriteFromObject(data)));
  }
}

@Injectable()
export class RemoveFavoriteFromFavorites<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const { artists, albums, tracks } = data;
        return {
          artists: remoreFavoriteFromObjectsArray(artists),
          albums: remoreFavoriteFromObjectsArray(albums),
          tracks: remoreFavoriteFromObjectsArray(tracks),
        } as any;
      }),
    );
  }
}
