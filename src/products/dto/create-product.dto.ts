import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsPositive()
  @IsNotEmpty()
  currentStock: number;
}
