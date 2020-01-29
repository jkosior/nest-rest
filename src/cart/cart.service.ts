import { Cart } from '@entities/cart.entity';
import { Injectable } from '@nestjs/common';
import { ProductDto } from '@product/product.dto';
import { ProductService } from '@product/product.service';
import { Repository, FindOneOptions } from 'typeorm';
import { CartDto, CreateCartDto, CartProduct } from './cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { findIndex } from 'lodash';
import { AbstractService } from '@server/abstracts/abstract.service';

@Injectable()
export class CartService extends AbstractService<Cart> {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {
    super();
    this.name = 'Cart';
  }

  async getAll(): Promise<CartDto[]> {
    const carts: Cart[] = await this.cartRepository.find();
    return carts.map(cart => Cart.toDto(cart));
  }

  async getOne(cartId: string): Promise<Cart> {
    try {
      return await this.cartRepository.findOne(cartId);
    } catch (err) {
      this.throwNotFound();
    }
  }

  async create(cart: CreateCartDto): Promise<Cart> {
    const localCart: Cart = this.cartRepository.create(cart);
    const saved: Cart = await this.save(localCart);
    return saved;
  }

  async update(cartId: string, cart: CartDto): Promise<Cart> {
    const exists = await this.checkIfExists(cartId);

    if (!exists) {
      this.throwNotFound();
    }

    await this.cartRepository.update(cartId, cart);
    const found = await this.getOne(cartId);
    return found;
  }

  async addToCart(cartId: string, products: CartProduct[]): Promise<Cart> {
    const exists = await this.checkIfExists(cartId);

    if (!exists) {
      this.throwNotFound();
    }

    const cart = await this.getOne(cartId);

    if (cart.isCheckedOut) {
      throw new Error('Cart is checked out');
    }

    for (const prod of products) {
      const productInCartIndex = this.productInCart(cart, prod.id);

      if (productInCartIndex !== -1) {
        cart.products[productInCartIndex].quantity += prod.quantity;
      } else {
        const priceData = await this.productService.getPriceInCurrency(
          prod.id,
          cart.currency,
        );
        cart.products.push({
          id: prod.id,
          quantity: prod.quantity,
          price: priceData.value,
        });
      }
    }

    await this.save(cart);

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

    const index = this.productInCart(cart, productId);

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

    if (currencyName !== cart.currency) {
      cart.currency = currencyName;
      cart.products = await Promise.all(
        cart.products.map(
          async p => await this.recalculatePrice(p, currencyName),
        ),
      );
    }

    await this.save(cart);
    return cart;
  }

  private async save(cart: Cart): Promise<Cart> {
    return await this.cartRepository.save(cart);
  }

  private productInCart(cart: Cart, productId: string) {
    return cart.products.findIndex(product => product.id === productId);
  }

  private async recalculatePrice(
    product: CartProduct,
    currencyName: string,
  ): Promise<CartProduct> {
    const priceData = await this.productService.getPriceInCurrency(
      product.id,
      currencyName,
    );
    product.price = priceData.value;
    return product;
  }

  protected async findById(id: string) {
    return this.cartRepository.findOne(id);
  }

  protected async findByOptions(options: FindOneOptions<Cart>) {
    return this.cartRepository.findOne(options);
  }
}
