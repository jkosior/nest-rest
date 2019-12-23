import { Cart } from '@entities/cart.entity';
import { Product } from '@entities/product.entity';
import { Injectable } from '@nestjs/common';
import { ProductService } from '@product/product.service';
import { Repository } from 'typeorm';
import { CartDto } from './cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { findIndex } from 'lodash';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {}

  async getAll(): Promise<CartDto[]> {
    const carts = await this.cartRepository.find();
    return carts.map(cart => Cart.toDto(cart));
  }

  async getOne(cartId: string): Promise<Cart> {
    return await this.cartRepository.findOne(cartId);
  }

  async create(cart: CartDto): Promise<Cart> {
    const localCart = this.cartRepository.create(cart);
    cart.products = cart.products || [];
    const saved = await this.save(localCart);
    return saved;
  }

  async update(cartId: string, cart: CartDto ): Promise<Cart> {
    await this.cartRepository.update(cartId, cart);
    const found = await this.getOne(cartId);
    return found;
  }

  async addToCart(cartId: string, products: Product[]): Promise<Cart> {
    const cart = await this.getOne(cartId);

    if (cart.isCheckedOut) {
      throw new Error('Cart is checked out');
    }

    cart.products.push(...products);
    return cart;
  }

  async removeFromCart(cartId: string, productId: string) {
    const cart = await this.getOne(cartId);

    if (cart.isCheckedOut) {
      throw new Error('Cart is checked out');
    }

    if (cart.products.length === 0) {
      throw new Error('No products in cart');
    }

    const index = findIndex(cart.products, (product) => product.id === productId);

    if (index === -1) {
      throw new Error('Product not in cart');
    }

    cart.products = cart.products.splice(index, 1);
    await this.save(cart);
    return cart;
  }

  async checkoutCart(cartId: string, currencyName: string = 'EUR') {
    const cart = await this.getOne(cartId);
    cart.isCheckedOut = true;
    await this.save(cart);

    const prices = this.productService.productsCheckout(cart.products, currencyName);
    return prices;
  }

  private async save(cart: Cart): Promise<Cart> {
    return await this.cartRepository.save(cart);
  }
}
