import { CartDto, CreateCartDto, AddCartProduct } from '@cart/cart.dto';
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
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AbstractController } from '@server/abstracts/abstract.controller';

@ApiTags('Cart')
@Controller('cart')
export class CartController extends AbstractController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Create cart', type: CartDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createCart(@Body() cart: CreateCartDto): Promise<CartDto> {
    return Cart.toDto(await this.cartService.create(cart));
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get cart value', type: CartDto })
  @ApiNotFoundResponse({ description: 'Cart not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getCart(@Param('id') id: string): Promise<Cart> {
    try {
      return Cart.toDto(await this.cartService.getOne(id));
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Put(':id/add')
  @ApiBody({ type: AddCartProduct })
  @ApiOkResponse({ description: 'Product added to the cart', type: CartDto })
  @ApiNotFoundResponse({ description: 'Cart or product not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async addToCart(
    @Param('id') id: string,
    @Body('product') product: AddCartProduct,
  ): Promise<CartDto> {
    try {
      return Cart.toDto(await this.cartService.addToCart(id, product));
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Put(':id/remove/:productId')
  @ApiOkResponse({ description: 'Remove product from cart', type: CartDto })
  @ApiNotFoundResponse({ description: 'Cart or product not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async removeFromCart(
    @Param('id') id: string,
    @Param('productId') product: string,
  ): Promise<CartDto> {
    try {
      return Cart.toDto(await this.cartService.removeFromCart(id, product));
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Post(':id/checkout')
  @ApiResponse({ status: 200, description: 'Checkout cart', type: CartDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async checkoutCart(
    @Param('id') id: string,
    @Query('currency') currency: string,
  ): Promise<CartDto> {
    return Cart.toDto(
      await this.cartService.checkoutCart(id, currency || 'EUR'),
    );
  }
}
