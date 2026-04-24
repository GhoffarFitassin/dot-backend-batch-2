import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  judul!: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'progress', 'done'])
  status?: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId!: string;
}
