import { IsNotEmpty } from 'class-validator';

export class UpdateOperationDto {
  @IsNotEmpty()
  description: string;
}
