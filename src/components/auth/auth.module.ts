import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'Hy787tgGYUF^R%rbghjb jh^$$%EDF',
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME ?? '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
