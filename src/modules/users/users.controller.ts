import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DetailUserDto } from './dto/detail-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param() params: DetailUserDto): Promise<IUser> {
    return this.findOneOrFail(params.id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param() params: DetailUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const user = await this.findOneOrFail(params.id);
    return this.usersService.updateUserByParams(user.id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: DetailUserDto): Promise<void> {
    const user = await this.findOneOrFail(params.id);
    await this.usersService.deleteUserByParams(user.id);
  }

  private async findOneOrFail(id: string): Promise<IUser> {
    const user = await this.usersService.findOneByParams(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
