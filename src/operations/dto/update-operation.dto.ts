import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateOperationDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
