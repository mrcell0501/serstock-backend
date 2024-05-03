import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/@database/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let createdProductId: number;
    try {
      const data = await this.productRepository.insert(createProductDto);
      createdProductId = data.raw?.[0]?.id;
    } catch (error) {
      if (error?.constraint?.startsWith('UQ_')) {
        throw new HttpException(
          'duplicated entry for the provided name',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    return await this.findOne(createdProductId);
  }

  async findAll() {
    return this.productRepository.find({ order: { name: 'ASC' } });
  }

  async findAllByIds(ids: number[]) {
    return this.productRepository
      .createQueryBuilder()
      .whereInIds(ids)
      .getMany();
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      await this.productRepository.update(id, updateProductDto);
      return await this.findOne(id);
    } catch (error) {
      if (error?.constraint?.startsWith('UQ_')) {
        throw new HttpException(
          'duplicated entry for the provided name',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
