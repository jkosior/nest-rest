import { pick } from 'lodash';
import { BaseEntity } from './base.entity';
import { CartProduct } from '@cart/cart.dto';
import { Entity, Column } from 'typeorm';

@Entity('cart')
export class Cart extends BaseEntity {
  @Column()
  owner: string;

  @Column()
  totalPrice: number;

  @Column({ default: false })
  isCheckedOut: boolean;

  @Column({ default: 'USD' })
  currency: string;

  @Column('json', { nullable: true })
  products: CartProduct[];

  static toDto(cart: Cart) {
    return pick(cart, ['id', 'owner', 'products', 'isCheckedOut']);
  }
}
