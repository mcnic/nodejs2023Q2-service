import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShowingUser, User } from '../user.interface';
import { newUUID } from 'src/helpers/uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async assertUserExistById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');
  }

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async isExist(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    return !!user;
  }

  async getById(userId: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getByLogin(userLogin: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { login: userLogin },
    });
  }

  async add(login: string, password: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (user) return user;

    const timestamp = new Date();

    const newUser = await this.prisma.user.create({
      data: {
        id: newUUID(),
        login,
        password,
        version: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    return newUser;
  }

  async changePasswordById(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.getById(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('OldPassword is wrong');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });
  }

  async removedById(id: string) {
    await this.assertUserExistById(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
