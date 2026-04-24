import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { ITask } from './interfaces/task.interface';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<ITask> {
    try {
      const task = await this.prisma.task.create({
        data: createTaskDto,
      });

      return task as ITask;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findAll(): Promise<ITask[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        include: {
          user: true,
          category: true,
        },
      });

      return tasks as ITask[];
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findById(id: string): Promise<ITask | null> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          user: true,
          category: true,
        },
      });

      return task as ITask | null;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async updateById(id: string, updateTaskDto: UpdateTaskDto): Promise<ITask> {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });

      return task as ITask;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }
}
