import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  nama!: string;

  @IsNotEmpty()
  @IsString()
  deskripsi!: string;
}
