import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';
import { UpdatePasswordDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { validateID } from 'src/helpers/validate';
import {
  TranformUser,
  TranformUsers,
} from 'src/interceptors/tranformUser.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(new TranformUsers())
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @UseInterceptors(new TranformUser())
  async getById(@Param('id', validateID) id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new TranformUser())
  async addUser(@Body() dto: CreateUserDto): Promise<User> {
    const { login, password } = dto;

    return await this.userService.add(login, password);
  }

  @Put(':id')
  @UseInterceptors(new TranformUser())
  async updateById(
    @Param('id', validateID) id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<User> {
    const { oldPassword, newPassword } = dto;

    await this.userService.changePasswordById(id, oldPassword, newPassword);

    return await this.userService.getById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeById(@Param('id', validateID) id: string) {
    await this.userService.removedById(id);
  }
}
