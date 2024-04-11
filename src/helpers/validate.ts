import {
  BadRequestException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class validateID implements PipeTransform<string, string> {
  transform(id: string) {
    if (!uuidValidate(id))
      throw new BadRequestException('id is invalid (not uuid)');

    return id;
  }
}

@Injectable()
export class validateRefreshToken implements PipeTransform {
  transform(body: { refreshToken: string }) {
    const refreshToken = body.refreshToken;
    const errors = [];

    if (!refreshToken) errors.push('refreshToken should not be empty');

    if (!isString(refreshToken)) errors.push('refreshToken must be a string');

    if (errors.length) throw new UnauthorizedException(errors);

    return body;
  }
}
