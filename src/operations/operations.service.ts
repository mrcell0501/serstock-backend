import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Operation,
  OperationType,
} from 'src/@database/entities/operation.entity';
import { Repository } from 'typeorm';
import { OperationProduct } from 'src/@database/entities/operation-products.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/@database/entities/product.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,

    private productsService: ProductsService,
  ) {}
  async create(assigneeUserId, dto: CreateOperationDto) {
    const productsIds = [...new Set(dto.products.map((p) => p.productId))];
    if (productsIds.length < dto.products.length) {
      throw new HttpException(
        'duplicated entries for productId',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productsFound = await this.productsService.findAllByIds(productsIds);
    if (productsFound.length < productsIds.length) {
      const invalidProductsIds = productsIds.filter(
        (productId) => !productsFound.some((p) => p.id === productId),
      );
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'invalid entries for products.productId',
          cause: { invalidProductsIds },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const productsWithNewStock = productsFound.map((p) => {
      const { quantity } = dto.products.find((op) => op.productId === p.id);
      const newStock =
        dto.type === OperationType.IN
          ? p.currentStock + quantity
          : p.currentStock - quantity;

      return { ...p, currentStock: newStock };
    });

    const productsWithInvalidStock = productsWithNewStock.filter(
      (p) => p.currentStock < 0,
    );
    if (productsWithInvalidStock.length) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'some products would be with invalid stock',
          cause: { productsWithInvalidStock },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let operationId: number;
    await this.operationRepository.manager.transaction(async (transaction) => {
      const operation = await transaction.save(Operation, {
        description: dto.description,
        type: dto.type,
        assigneeUserId: assigneeUserId,
      });

      const operationProducts = dto.products.map((p) => ({
        ...p,
        operationId: operation.id,
      }));

      const updateProductOperationFn = async () => {
        await transaction
          .createQueryBuilder()
          .insert()
          .into(OperationProduct)
          .values(operationProducts)
          .execute();
      };
      const updateProductsFn = async () => {
        await Promise.all(
          productsWithNewStock.map((p) =>
            transaction
              .createQueryBuilder()
              .update(Product)
              .set({ currentStock: p.currentStock })
              .where('id = :id', { id: p.id })
              .execute(),
          ),
        );
      };

      await Promise.all([updateProductOperationFn(), updateProductsFn()]);

      operationId = operation.id;
    });

    return this.findOne(operationId);
  }

  async findAll() {
    return await this.operationRepository.find({
      relations: ['assignee'],
    });
  }

  async findOne(id: number) {
    try {
      return await this.operationRepository.findOneOrFail({
        where: { id },
        relations: ['assignee', 'products', 'products.product'],
      });
    } catch (error) {
      throw new HttpException('operation not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, dto: UpdateOperationDto) {
    await this.findOne(id);
    await this.operationRepository.update(id, dto);
  }
}
