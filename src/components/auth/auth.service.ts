import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UserService } from '../users/user.service';
import { AuthLoginResponse, AuthSingnupResponse } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private logger: Logger,
  ) {}

  async signup({
    login,
    password,
  }: CreateUserDto): Promise<AuthSingnupResponse> {
    const user = await this.userService.add(login, password);
    return { id: user.id };
  }

  async getTokent(userId: string, login: string): Promise<AuthLoginResponse> {
    const payload = { userId, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async login({ login, password }: CreateUserDto): Promise<AuthLoginResponse> {
    const user = await this.userService.testAuth(login, password);

    return await this.getTokent(user.id, user.login);
  }

  async refresh({
    refreshToken,
  }: Record<string, any>): Promise<AuthLoginResponse> {
    try {
      const user = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      return await this.getTokent(user.userId, user.login);
    } catch {
      throw new ForbiddenException();
    }
  }
}
