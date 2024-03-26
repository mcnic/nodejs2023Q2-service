import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UserService } from '../users/user.service';
import { getNewToken } from 'src/helpers/jwt';
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
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = '';
    this.logger.warn(`access_token (${accessToken}) (${refreshToken})`);

    return { accessToken, refreshToken };
  }

  // TODO: wip
  async refresh({
    refreshToken,
  }: Record<string, any>): Promise<RefreshTokenResponse> {
    // testToken(refreshToken) - error 403

    return await getNewToken(refreshToken);
  }
}
