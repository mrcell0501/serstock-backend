import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsPositive,
} from 'class-validator';
import { OperationType } from 'src/@database/entities/operation.entity';

class ProductDto {
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOperationDto {
  @IsNotEmpty()
  description: string;

  @IsEnum(OperationType)
  @IsNotEmpty()
  type: OperationType;

  // @IsNotEmptyObject()
  products: ProductDto[];
}
