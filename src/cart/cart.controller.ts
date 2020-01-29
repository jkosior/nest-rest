import { CartDto, CreateCartDto, CartProduct } from '@cart/cart.dto';
import { CartService } from '@cart/cart.service';
import { Cart } from '@entities/cart.entity';
import { Controller, Post, Get, Body, Patch, HttpCode, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from '@server/abstracts/abstract.controller';

@ApiTags('Cart')
@Controller('cart')
export class CartController extends AbstractController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  @Post()
  @HttpCode(201)
  async createCart(@Body() cart: CreateCartDto): Promise<CartDto> {
    return Cart.toDto(
      await this.cartService.create(cart),
    );
  }

  @Get(':id')
  async getCart(@Param('id') id: string): Promise<Cart> {
    try {
      return await this.cartService.getOne(id);
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Patch(':id/add')
  async addToCart(@Param('id') id: string, @Body('products') products: CartProduct[]): Promise<CartDto> {
    try {
      return Cart.toDto(
        await this.cartService.addToCart(id, products),
      )
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Post('checkout')
  checkoutCart(): Promise<void> {
    return new Promise(null);
  }
}
