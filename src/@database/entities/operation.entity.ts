import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OperationProduct } from './operation-products.entity';
import { Product } from './product.entity';

export enum OperationType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  type: OperationType;

  @Column()
  assigneeUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigneeUserId' })
  assignee: User;

  @OneToMany(() => OperationProduct, (op) => op.operation)
  products: OperationProduct[];
}
