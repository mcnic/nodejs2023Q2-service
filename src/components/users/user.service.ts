import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShowingUser, User } from '../user.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';
import { getTimestamp } from 'src/helpers/time';

@Injectable()
export class UserService {
  users: User[] = [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      login: 'user1',
      password: 'user1',
      version: 1,
      createdAt: 223123132,
      updatedAt: 88789897987,
    },
  ];

  assertUserId(id: string) {
    if (!isValidUUID(id))
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
  }

  async assertUserExistById(id: string) {
    const user = await this.isUserExist(id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  getShowngUser(user: User): ShowingUser {
    const { id, login, version, createdAt, updatedAt } = user;

    return { id, login, version, createdAt, updatedAt };
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async isUserExist(userId: string): Promise<boolean> {
    return !!this.users.find(({ id }) => id === userId);
  }

  async isUserPasswordCorrect(
    userId: string,
    userPassword: string,
  ): Promise<boolean> {
    const user = await this.getById(userId);

    return user.password === userPassword;
  }

  async getById(userId: string): Promise<User | undefined> {
    this.assertUserId(userId);

    const user = this.users.find(({ id }) => id === userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getUserByLogin(userLogin: string): Promise<User> {
    return this.users.find(({ login }) => login === userLogin);
  }

  async addUser(login: string, password: string): Promise<User> {
    if (
      !login ||
      !password ||
      typeof login !== 'string' ||
      typeof password !== 'string'
    )
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);

    const user = await this.getUserByLogin(login);

    if (user) throw new HttpException('Use just exist', HttpStatus.BAD_REQUEST);

    const timestamp = getTimestamp();
    const newUser: User = {
      id: newUUID(),
      login,
      password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.push(newUser);

    return newUser;
  }

  async changeUserPasswordById(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    if (
      !oldPassword ||
      !newPassword ||
      typeof oldPassword !== 'string' ||
      typeof newPassword !== 'string'
    )
      throw new HttpException('Invalid password data', HttpStatus.BAD_REQUEST);

    this.assertUserId(id);

    if (!(await this.isUserPasswordCorrect(id, oldPassword)))
      throw new HttpException('OldPassword is wrong', HttpStatus.FORBIDDEN);

    const user = await this.getById(id);

    user.password = newPassword;
    user.updatedAt = getTimestamp();
    user.version = user.version + 1;
  }

  async removedById(userId: string) {
    this.assertUserId(userId);
    await this.assertUserExistById(userId);

    this.users = this.users.filter(({ id }) => id !== userId);
  }
}
