import { Cart } from '@entities/cart.entity';
import { Injectable } from '@nestjs/common';
import { ProductService } from '@product/product.service';
import { Repository, FindOneOptions } from 'typeorm';
import {
  CartDto,
  CreateCartDto,
  CartProduct,
  AddCartProduct,
} from './cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '@server/abstracts/abstract.service';
import { Catch } from '@server/cach.decorator';

@Injectable()
export class CartService extends AbstractService<Cart> {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {
    super();
    this.name = 'Cart';
  }

  @Catch()
  async getAll(): Promise<CartDto[]> {
    const carts: Cart[] = await this.cartRepository.find();
    return carts.map(cart => Cart.toDto(cart));
  }

  @Catch()
  async getOne(cartId: string): Promise<Cart> {
    try {
      return await this.cartRepository.findOne(cartId);
    } catch (err) {
      this.throwNotFound();
    }
  }

  @Catch()
  async create(cart: CreateCartDto): Promise<Cart> {
    const localCart: Cart = this.cartRepository.create(cart);
    const saved: Cart = await this.save(localCart);
    return saved;
  }

  @Catch()
  async update(cartId: string, cart: CartDto): Promise<Cart> {
    const exists = await this.checkIfExists(cartId);

    if (!exists) {
      this.throwNotFound();
    }

    await this.cartRepository.update(cartId, cart);
    const found = await this.getOne(cartId);
    return found;
  }

  @Catch()
  async addToCart(cartId: string, product: AddCartProduct): Promise<Cart> {
    const exists = await this.checkIfExists(cartId);

    if (!exists) {
      this.throwNotFound();
    }

    const cart = await this.getOne(cartId);

    if (cart.isCheckedOut) {
      throw new Error('Cart is checked out');
    }
    cart.products = cart.products || [];

    await this.handleAddToCart(cart, product);

    await this.save(cart);
    return cart;
  }

  @Catch()
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

    this.productService.handleProductRemovedFromCart(cart.products[index]);

    cart.products = cart.products.splice(index, 1);
    await this.save(cart);
    return cart;
  }

  @Catch()
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

    cart.totalPrice = cart.products.reduce(
      (p1, p2) => p1 + p2.price * p2.quantity,
      0,
    );

    await this.save(cart);
    return cart;
  }

  // test use only
  @Catch()
  async deleteCart(cartId: string) {
    await this.cartRepository.delete(cartId);
  }

  @Catch()
  private async save(cart: Cart): Promise<Cart> {
    return await this.cartRepository.save(cart);
  }

  @Catch()
  private productInCart(cart: Cart, productId: string) {
    return cart.products === null
      ? -1
      : cart.products.findIndex(product => product.id === productId);
  }

  @Catch()
  private async handleAddToCart(cart: Cart, product: AddCartProduct) {
    const isAvailable = await this.productService.checkAvailability(product);

    if (!isAvailable) {
      const err: Error & { status?: number } = new Error(
        'Product is not available in given quantity',
      );
      err.status = 400;
      throw err;
    }

    const productInCartIndex = this.productInCart(cart, product.id);

    if (productInCartIndex !== -1) {
      cart.products[productInCartIndex].quantity += product.quantity;
    } else {
      const priceData = await this.productService.getPriceInCurrency(
        product.id,
        cart.currency,
      );

      cart.products.push({
        id: product.id,
        quantity: product.quantity,
        price: priceData.value,
      });
    }
  }

  @Catch()
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
