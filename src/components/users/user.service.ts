import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ShowingUser, User } from '../user.interface';
import { isValidUUID, newUUID } from 'src/helpers/uuid';
import { getTimestamp } from 'src/helpers/time';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';

@Injectable()
export class UserService {
  constructor(@Inject(MEMORY_STORE) private readonly store: MemoryStore) {}

  assertId(id: string) {
    if (!isValidUUID(id))
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
  }

  async assertUserExistById(id: string) {
    const user = await this.isExist(id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  getShowngUser(user: User): ShowingUser {
    const { id, login, version, createdAt, updatedAt } = user;

    return { id, login, version, createdAt, updatedAt };
  }

  async getAll(): Promise<User[]> {
    const store = await this.store.getStore();

    return store.users;
  }

  async isExist(userId: string): Promise<boolean> {
    const store = await this.store.getStore();

    return !!store.users.find(({ id }) => id === userId);
  }

  async isPasswordCorrect(
    userId: string,
    userPassword: string,
  ): Promise<boolean> {
    const user = await this.getById(userId);

    return user.password === userPassword;
  }

  async getById(userId: string): Promise<User | undefined> {
    this.assertId(userId);

    const store = await this.store.getStore();
    const user = store.users.find(({ id }) => id === userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getByLogin(userLogin: string): Promise<User> {
    const store = await this.store.getStore();

    return store.users.find(({ login }) => login === userLogin);
  }

  async add(login: string, password: string): Promise<User> {
    if (
      !login ||
      !password ||
      typeof login !== 'string' ||
      typeof password !== 'string'
    )
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);

    const user = await this.getByLogin(login);

    if (user) return user;

    const timestamp = getTimestamp();
    const newUser: User = {
      id: newUUID(),
      login,
      password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const store = await this.store.getStore();
    const users = store.users;
    users.push(newUser);
    await this.store.setStore({ ...store, users });

    return newUser;
  }

  async changePasswordById(
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

    this.assertId(id);

    if (!(await this.isPasswordCorrect(id, oldPassword)))
      throw new HttpException('OldPassword is wrong', HttpStatus.FORBIDDEN);

    const store = await this.store.getStore();
    const users = store.users.map((user) => {
      return user.id === id
        ? {
            ...user,
            password: newPassword,
            updatedAt: getTimestamp(),
            version: user.version + 1,
          }
        : user;
    });
    await this.store.setStore({ ...store, users });
  }

  async removedById(userId: string) {
    this.assertId(userId);
    await this.assertUserExistById(userId);

    const store = await this.store.getStore();
    const users = store.users.filter(({ id }) => id !== userId);
    await this.store.setStore({ ...store, users });
  }
}
