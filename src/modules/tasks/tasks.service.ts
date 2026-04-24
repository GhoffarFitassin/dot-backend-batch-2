import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { ITask } from './interfaces/task.interface';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<ITask> {
    const user = await this.prisma.user.findUnique({
      where: { id: createTaskDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: createTaskDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.tasksRepository.create(createTaskDto);
  }

  async getTasks(): Promise<ITask[]> {
    return this.tasksRepository.findAll();
  }

  async findOneByParams(id: string): Promise<ITask | null> {
    return this.tasksRepository.findById(id);
  }

  async updateTaskByParams(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ITask> {
    if (updateTaskDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    if (updateTaskDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateTaskDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.tasksRepository.updateById(id, updateTaskDto);
  }

  async deleteTaskByParams(id: string): Promise<void> {
    return this.tasksRepository.deleteById(id);
  }
}
