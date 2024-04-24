import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { Operation } from './operation.entity';

@Entity()
export class OperationProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operationId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Operation, (o) => o.products)
  operation: Operation;

  @ManyToOne(() => Product, (p) => p.operations)
  product: Product;
}
