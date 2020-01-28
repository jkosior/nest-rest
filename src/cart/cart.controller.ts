import { CartDto } from '@cart/cart.dto';
import { CartService } from '@cart/cart.service';
import { Cart } from '@entities/cart.entity';
import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // @Get()
  // getAllCarts(): Promise<Cart[]> {
  //   return this.cartService.getAll();
  // }

  @Post()
  createCart(@Body() cart: CartDto): Promise<Cart> {
    return this.cartService.create(cart);
  }

  @Post('/checkout')
  checkoutCart(): Promise<void> {
    return new Promise(null);
  }
}
