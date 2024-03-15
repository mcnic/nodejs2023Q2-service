import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MemoryDbProvider } from 'src/db/memoryStore';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService, MemoryDbProvider],
  imports: [PrismaModule],
})
export class UserModule {}
