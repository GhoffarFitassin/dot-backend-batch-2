import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DetailCategoryDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id!: string;
}
