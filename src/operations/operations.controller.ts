import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @ApiBearerAuth('jwt')
  @Post()
  create(@Body() createOperationDto: CreateOperationDto, @Request() req) {
    return this.operationsService.create(req.user.sub, createOperationDto);
  }

  @ApiBearerAuth('jwt')
  @Get()
  findAll() {
    return this.operationsService.findAll();
  }

  @ApiBearerAuth('jwt')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.operationsService.findOne(id);
  }

  @ApiBearerAuth('jwt')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOperationDto: UpdateOperationDto,
  ) {
    return this.operationsService.update(id, updateOperationDto);
  }
}
