import { pick } from 'lodash';
import { BaseEntity } from './base.entity';
import { Entity, ManyToMany, Column } from 'typeorm';
import { Product } from './product.entity';

@Entity('cart')
export class Cart extends BaseEntity {
  @Column()
  owner: string;

  @ManyToMany(type => Product, { nullable: true })
  products: Product[];

  static toDto(cart: Cart) {
    return pick(cart, ['owner', 'products']);
  }
}
