import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    return this.usersRepository.create(createUserDto);
  }

  async getUsers(): Promise<IUser[]> {
    return this.usersRepository.findAll();
  }

  async findOneByParams(id: string): Promise<IUser | null> {
    return this.usersRepository.findById(id);
  }

  async updateUserByParams(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.usersRepository.updateById(id, updateUserDto);
  }

  async deleteUserByParams(id: string): Promise<void> {
    return this.usersRepository.deleteById(id);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.usersRepository.findByUsername(username);
  }
}
