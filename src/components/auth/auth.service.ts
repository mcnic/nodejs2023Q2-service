import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UserService } from '../users/user.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { getNewToken, getToken } from 'src/helpers/jwt';
import { RefreshTokenResponse } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup({ login, password }: CreateUserDto) {
    await this.userService.add(login, password);
  }

  async login({ login, password }: CreateUserDto): Promise<string> {
    await this.userService.testAuth(login, password);

    return await getToken();
  }

  async refresh({
    refreshToken,
  }: RefreshTokenDto): Promise<RefreshTokenResponse> {
    // testToken(refreshToken) - error 403

    return await getNewToken(refreshToken);
  }
}
