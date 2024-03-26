import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import {
  AuthLoginResponse,
  AuthSingnupResponse,
  RefreshTokenResponse,
} from './auth.interface';
import { validateRefreshToken } from 'src/helpers/validate';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  refreshTokenValidation = new ValidationPipe({
    exceptionFactory: (errors) => {
      return new UnprocessableEntityException(errors);
    },
  });
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<AuthSingnupResponse> {
    return await this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: CreateUserDto): Promise<AuthLoginResponse> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new validateRefreshToken())
    dto: // 'Record<string, any>' used for manual validate with validateRefreshToken()
    Record<string, any>,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refresh(dto);
  }
}
