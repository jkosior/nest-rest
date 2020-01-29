import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Res,
  HttpCode,
  Put,
  Patch,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ProductDto, CreateProductDto } from '@product/product.dto';
import { ProductService } from '@product/product.service';
import { logger } from '@server/logger';
import { Response } from 'express';
import { AbstractController } from '@server/abstracts/abstract.controller';

@ApiTags('Product')
@Controller('product')
export class ProductController extends AbstractController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get products', type: ProductDto })
  getAll(): Promise<ProductDto[]> {
    return this.productService.getAll();
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, type: ProductDto, description: 'Create product' })
  createProduct(@Body() createProduct: CreateProductDto): Promise<ProductDto> {
    return this.productService.create(createProduct);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProductDto, description: 'Get product' })
  async getOne(@Param('id') id: string): Promise<ProductDto> {
    try {
      return await this.productService.getOne(id);
    } catch (err) {
      this.handleError(err, 404);
    }
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: ProductDto, description: 'Update product' })
  async updateOne(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProduct: ProductDto,
  ): Promise<ProductDto> {
    try {
      return await this.productService.update(id, updateProduct);
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: ProductDto, description: 'Update product' })
  async patchOne(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() patchProduct: Partial<ProductDto>,
  ): Promise<ProductDto> {
    try {
      return await this.productService.update(id, patchProduct);
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
