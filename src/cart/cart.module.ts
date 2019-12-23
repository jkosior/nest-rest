import { CurrencyModule } from '@currency/currency.module';
import { Cart } from '@entities/cart.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@product/product.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
    ]),
    CurrencyModule,
    ProductModule,
  ],
  controllers: [CartController],
  providers: [
    CartService,
  ],
})
export class CartModule {}
