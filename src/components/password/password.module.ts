import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';

@Module({
  controllers: [],
  providers: [PasswordService],
  imports: [],
  exports: [PasswordService],
})
export class PasswordModule {}
