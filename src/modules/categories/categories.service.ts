import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { ICategory } from './interfaces/category.interface';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  async getCategories(): Promise<ICategory[]> {
    return this.categoriesRepository.findAll();
  }

  async findOneByParams(id: string): Promise<ICategory | null> {
    return this.categoriesRepository.findById(id);
  }

  async updateCategoryByParams(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ICategory> {
    return this.categoriesRepository.updateById(id, updateCategoryDto);
  }

  async deleteCategoryByParams(id: string): Promise<void> {
    return this.categoriesRepository.deleteById(id);
  }
}
