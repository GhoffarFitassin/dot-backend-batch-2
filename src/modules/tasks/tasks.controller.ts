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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { DetailTaskDto } from './dto/detail-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { ITask } from './interfaces/task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(): Promise<ITask[]> {
    return this.tasksService.getTasks();
  }

  @Get(':id')
  async getTaskById(@Param() params: DetailTaskDto): Promise<ITask> {
    return this.findOneOrFail(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<ITask> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  async update(
    @Param() params: DetailTaskDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<ITask> {
    await this.findOneOrFail(params.id);
    return this.tasksService.updateTaskByParams(params.id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: DetailTaskDto): Promise<void> {
    await this.findOneOrFail(params.id);
    await this.tasksService.deleteTaskByParams(params.id);
  }

  private async findOneOrFail(id: string): Promise<ITask> {
    const task = await this.tasksService.findOneByParams(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
