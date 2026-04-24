import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { IUser } from './interfaces/user.interface';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      return user as IUser;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      const user = await this.prisma.user.findMany({
        orderBy: {
          id: 'desc',
        },
      });
      return user as IUser[];
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      return user as IUser | null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      return user as IUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      return user as IUser | null;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }
}
