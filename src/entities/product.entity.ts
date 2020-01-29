import { Price, ProductDto } from '@product/product.dto';
import { omit } from 'lodash';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('json')
  price: Price[];

  @Column()
  quantity: number;

  static toDto(product: Product): ProductDto {
    return omit(product, ['createdDateTime', 'lastChangedDateTime']);
  }
}
