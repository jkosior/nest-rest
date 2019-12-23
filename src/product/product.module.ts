import { Product } from '@entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CurrencyModule } from '@currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
    ]),
    CurrencyModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
