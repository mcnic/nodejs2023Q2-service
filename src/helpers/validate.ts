import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class validateID implements PipeTransform<string, string> {
  transform(id: string) {
    if (!uuidValidate(id))
      throw new BadRequestException('id is invalid (not uuid)');

    return id;
  }
}
