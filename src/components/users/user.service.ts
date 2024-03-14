import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShowingUser, User } from '../user.interface';
import { newUUID } from 'src/helpers/uuid';
import { getTimestamp } from 'src/helpers/time';
import { MEMORY_STORE } from 'src/db/memoryStore';
import { MemoryStore } from 'src/db/memoryStore';

@Injectable()
export class UserService {
  constructor(@Inject(MEMORY_STORE) private readonly store: MemoryStore) {}

  async assertUserExistById(id: string) {
    const user = await this.isExist(id);

    if (!user) throw new NotFoundException('User not found');
  }

  getShowngUser(user: User): ShowingUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return { ...userWithoutPassword };
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
    const store = await this.store.getStore();
    const user = store.users.find(({ id }) => id === userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getByLogin(userLogin: string): Promise<User> {
    const store = await this.store.getStore();

    return store.users.find(({ login }) => login === userLogin);
  }

  async add(login: string, password: string): Promise<User> {
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
    if (!(await this.isPasswordCorrect(id, oldPassword)))
      throw new ForbiddenException('OldPassword is wrong');

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
    await this.assertUserExistById(userId);

    const store = await this.store.getStore();
    const users = store.users.filter(({ id }) => id !== userId);
    await this.store.setStore({ ...store, users });
  }
}
