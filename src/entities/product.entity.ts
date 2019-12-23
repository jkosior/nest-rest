import {Column, Entity} from 'typeorm';
import { BaseEntity} from './base.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  price: string;

  @Column()
  quantity: number;
}