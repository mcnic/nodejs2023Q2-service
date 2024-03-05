import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/app.types';
import { validate as uuidValidate } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.appService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | undefined> {
    console.log('request', id);

    if (!uuidValidate(id))
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.appService.getUserById(id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }
}
