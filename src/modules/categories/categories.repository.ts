import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { ICategory } from './interfaces/category.interface';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });
      return category as ICategory;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findAll(): Promise<ICategory[]> {
    try {
      const category = await this.prisma.category.findMany({
        orderBy: {
          id: 'desc',
        },
      });
      return category as ICategory[];
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async findById(id: string): Promise<ICategory | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      return category as ICategory | null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async updateById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ICategory> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      return category as ICategory;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }
}
