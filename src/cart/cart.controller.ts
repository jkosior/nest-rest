import { CartDto } from '@cart/cart.dto';
import { CartService } from '@cart/cart.service';
import { Cart } from '@entities/cart.entity';
import { Controller, Post, Get, Body } from '@nestjs/common';

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


}
