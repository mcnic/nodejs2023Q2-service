import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  ShowingUser,
  UpdatePasswordDto,
} from '../user.interface';
import { validateID } from 'src/helpers/validate';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<ShowingUser[]> {
    const users = await this.userService.getAll();

    return users.map((user) => this.userService.getShowngUser(user));
  }

  @Get(':id')
  async getById(
    @Param('id', validateID) id: string,
  ): Promise<ShowingUser | undefined> {
    const user = await this.userService.getById(id);

    return this.userService.getShowngUser(user);
  }

  @Post()
  @HttpCode(201)
  async addUser(@Body() dto: CreateUserDto) {
    const { login, password } = dto;

    const user = await this.userService.add(login, password);

    return this.userService.getShowngUser(user);
  }

  @Put(':id')
  async updateById(
    @Param('id', validateID) id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<ShowingUser> {
    const { oldPassword, newPassword } = dto;

    await this.userService.changePasswordById(id, oldPassword, newPassword);

    const user = await this.userService.getById(id);

    return this.userService.getShowngUser(user);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeById(@Param('id', validateID) id: string) {
    await this.userService.removedById(id);
  }
}
