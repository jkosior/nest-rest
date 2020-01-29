import { CartDto, CreateCartDto, CartProduct } from '@cart/cart.dto';
import { CartService } from '@cart/cart.service';
import { Cart } from '@entities/cart.entity';
import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AbstractController } from '@server/abstracts/abstract.controller';

@ApiTags('Cart')
@Controller('cart')
export class CartController extends AbstractController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Create cart', type: CartDto })
  async createCart(@Body() cart: CreateCartDto): Promise<CartDto> {
    return Cart.toDto(await this.cartService.create(cart));
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get cart value', type: CartDto })
  async getCart(@Param('id') id: string): Promise<Cart> {
    try {
      return Cart.toDto(
        await this.cartService.getOne(id),
      );
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Post(':id/add')
  @ApiResponse({ status: 200, description: 'Add product/s to cart', type: CartDto })
  async addToCart(
    @Param('id') id: string,
    @Body('products') products: CartProduct[],
  ): Promise<CartDto> {
    try {
      return Cart.toDto(await this.cartService.addToCart(id, products));
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Post(':id/remove')
  @ApiResponse({ status: 200, description: 'Remove product from cart', type: CartDto })
  async removeFromCart(
    @Param('id') id: string,
    @Body('product') product: string,
  ): Promise<CartDto> {
    try {
      return Cart.toDto(await this.cartService.removeFromCart(id, product));
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Post(':id/checkout')
  @ApiResponse({ status: 200, description: 'Checkout cart', type: CartDto })
  async checkoutCart(@Param('id') id: string, @Query('curr') currency: string): Promise<CartDto> {
    return Cart.toDto(
      await this.cartService.checkoutCart(id, currency || 'EUR'),
    );
  }
}
