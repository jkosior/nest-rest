import { ProductDto } from 'src/product/product.dto';
import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { Catch } from '@server/cach.decorator';

@Controller('product')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get()
  @Catch()
  getAll(): Promise<ProductDto[]> {
    return this.productService.getAll();
  }

  @Post()
  @Catch()
  createProduct(@Body() createProduct: ProductDto) {
    return this.productService.create(createProduct);
  }

  @Get(':id')
  @Catch()
  getOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productService.getOne(id);
  }

  @Patch(':id')
  @Catch()
  updateOne(@Param('id') id: string, @Body() updateProduct: ProductDto): Promise<ProductDto> {
    return this.productService.update(id, updateProduct);
  }

  @Delete(':id')
  @Catch()
  deleteOne(@Param('id') id: string) {
    return this.productService.delete(id);
  }

}
