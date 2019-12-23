import { Cart } from '@entities/cart.entity';
import { Product } from '@entities/product.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartDto } from './cart.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  async getAll(): Promise<CartDto[]> {
    const carts = await this.cartRepository.find();
    return carts.map(cart => Cart.toDto(cart));
  }

  async create(cart: CartDto): Promise<Cart> {
    const localCart = this.cartRepository.create(cart);
    return await this.cartRepository.save(localCart);
  }

  async addToCart(cartId: string, products: Product[]) {
    // TODO
  }

  async removeFromCart(cartId: string, productId: string) {
    // TODO
  }

  async checkoutCart(cartId: string) {
    // TODO
  }
}
