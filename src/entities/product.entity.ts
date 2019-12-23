import { PriceDto, ProductDto } from '@product/product.dto';
import { pick } from 'lodash';
import { Column, Entity } from 'typeorm';
import { BaseEntity} from './base.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('json')
  price: PriceDto[];

  @Column()
  quantity: number;

  static toDto(product: Product): ProductDto {
    return pick(product, ['id', 'name', 'price', 'quantity']);
  }
}
