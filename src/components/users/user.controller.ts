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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<ShowingUser[]> {
    const users = await this.userService.getAllUsers();

    return users.map((user) => this.userService.getShowngUser(user));
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ShowingUser | undefined> {
    const user = await this.userService.getUserById(id);

    return this.userService.getShowngUser(user);
  }

  @Post()
  @HttpCode(201)
  async addUser(@Body() dto: CreateUserDto) {
    const { login, password } = dto;

    const user = await this.userService.addUser(login, password);

    return this.userService.getShowngUser(user);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<ShowingUser> {
    const { oldPassword, newPassword } = dto;

    await this.userService.changeUserPasswordById(id, oldPassword, newPassword);

    const user = await this.userService.getUserById(id);

    return this.userService.getShowngUser(user);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.userService.removeUserdById(id);
  }
}