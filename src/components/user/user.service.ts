import { Injectable } from '@nestjs/common';
import { User } from 'src/app.types';

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

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.users.find(({ id }) => id === userId);
  }
}
