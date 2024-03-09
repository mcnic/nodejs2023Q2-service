import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MemoryDbProvider } from 'src/db/memoryStore';

@Module({
  controllers: [UserController],
  providers: [UserService, MemoryDbProvider],
})
export class UserModule {}
