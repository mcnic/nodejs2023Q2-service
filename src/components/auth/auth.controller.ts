import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { RefreshTokenResponse } from './auth.interface';
import { validateRefreshToken } from 'src/helpers/validate';

@Controller('auth')
export class AuthController {
  refreshTokenValidation = new ValidationPipe({
    exceptionFactory: (errors) => {
      return new UnprocessableEntityException(errors);
    },
  });
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    await this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: CreateUserDto): Promise<string> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Body(new validateRefreshToken())
    // don't use RefreshTokenDto for manual validate!
    dto,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refresh(dto);
  }
}
