import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DetailUserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id!: string;
}
