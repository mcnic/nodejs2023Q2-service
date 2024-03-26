import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UserService } from '../users/user.service';
import {
  AuthLoginResponse,
  AuthSingnupResponse,
  RefreshTokenResponse,
} from './auth.interface';
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

  async login({ login, password }: CreateUserDto): Promise<AuthLoginResponse> {
    const user = await this.userService.testAuth(login, password);

    const payload = { id: user.id, login: user.login };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refresh({
    refreshToken,
  }: Record<string, any>): Promise<RefreshTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return { accessToken: await this.jwtService.signAsync(payload) };
    } catch {
      throw new ForbiddenException();
    }
  }
}
