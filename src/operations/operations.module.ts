import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { Operation } from 'src/@database/entities/operation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([Operation])],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
