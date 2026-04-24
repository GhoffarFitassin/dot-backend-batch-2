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
import { CreateCategoryDto } from './dto/create-category.dto';
import { DetailCategoryDto } from './dto/detail-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<ICategory[]> {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategoryById(
    @Param() params: DetailCategoryDto,
  ): Promise<ICategory> {
    return this.findOneOrFail(params.id);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param() params: DetailCategoryDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ICategory> {
    const category = await this.findOneOrFail(params.id);
    return this.categoriesService.updateCategoryByParams(
      category.id,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: DetailCategoryDto): Promise<void> {
    const category = await this.findOneOrFail(params.id);
    await this.categoriesService.deleteCategoryByParams(category.id);
  }

  private async findOneOrFail(id: string): Promise<ICategory> {
    const category = await this.categoriesService.findOneByParams(id);
    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }
}
