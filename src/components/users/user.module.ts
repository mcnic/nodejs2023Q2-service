import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordModule } from '../password/password.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, PasswordModule],
  exports: [UserService],
})
export class UserModule {}
