import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DetailTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id!: string;
}
