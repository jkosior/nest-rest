import { ProductDto } from 'src/product/product.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { Product } from '@entities/product.entity';

@Controller('product')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get()
  getAll(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id): Promise<Product> {
    return this.productService.getOne(id);
  }



}
