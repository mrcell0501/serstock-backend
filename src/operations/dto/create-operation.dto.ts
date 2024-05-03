import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { OperationType } from 'src/@database/entities/operation.entity';

class ProductDto {
  @ApiProperty({ minimum: 1 })
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ minimum: 1, example: 5 })
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOperationDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsEnum(OperationType)
  @IsNotEmpty()
  type: OperationType;

  @ApiProperty({ type: ProductDto, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
