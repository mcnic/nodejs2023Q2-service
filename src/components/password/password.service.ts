import { Injectable } from '@nestjs/common';
import { Password } from './password.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService implements Password {
  saltRound: number;

  constructor() {
    this.saltRound = parseInt(process.env.BCRYPT_SALT_ROUND) || 10;
  }

  async cryptPassword(password: string) {
    return await bcrypt.hash(password, this.saltRound);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
