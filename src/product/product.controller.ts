import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  HttpCode,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ProductDto, CreateProductDto } from '@product/product.dto';
import { ProductService } from '@product/product.service';
import { AbstractController } from '@server/abstracts/abstract.controller';
import { Product } from '@entities/product.entity';

@ApiTags('Product')
@Controller('product')
export class ProductController extends AbstractController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get products', type: ProductDto })
  async getAll(): Promise<ProductDto[]> {
    return (await this.productService.getAll())
      .map(product => Product.toDto(product));
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, type: ProductDto, description: 'Create product' })
  async createProduct(@Body() createProduct: CreateProductDto): Promise<ProductDto> {
    return Product.toDto(
      await this.productService.create(createProduct),
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProductDto, description: 'Get product' })
  async getOne(@Param('id') id: string): Promise<ProductDto> {
    try {
      return Product.toDto(
        await this.productService.getOne(id),
      );
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: ProductDto, description: 'Update product' })
  async updateOne(
    @Param('id') id: string,
    @Body() updateProduct: ProductDto,
  ): Promise<ProductDto> {
    try {
      return Product.toDto(
        await this.productService.update(id, updateProduct),
      );
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: ProductDto, description: 'Update product' })
  async patchOne(
    @Param('id') id: string,
    @Body() patchProduct: Partial<ProductDto>,
  ): Promise<ProductDto> {
    try {
      return Product.toDto(
        await this.productService.update(id, patchProduct),
      );
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 202, description: 'Delete product', type: '' })
  deleteOne(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
