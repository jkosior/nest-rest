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
import {
  ApiTags,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
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
  @ApiOkResponse({ description: 'Get products', type: ProductDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAll(): Promise<ProductDto[]> {
    return (await this.productService.getAll()).map(product =>
      Product.toDto(product),
    );
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: ProductDto, description: 'Create product' })
  @ApiBadRequestResponse({ description: 'Product already exists in database' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductDto> {
    return Product.toDto(await this.productService.create(createProduct));
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductDto, description: 'Get product' })
  @ApiNotFoundResponse({ description: 'Product not found in database' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getOne(@Param('id') id: string): Promise<ProductDto> {
    try {
      return Product.toDto(await this.productService.getOne(id));
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Put(':id')
  @ApiBody({ type: ProductDto })
  @ApiOkResponse({ type: ProductDto, description: 'Update product' })
  @ApiNotFoundResponse({ description: 'Product not found in database' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async updateOne(
    @Param('id') id: string,
    @Body() updateProduct: ProductDto,
  ): Promise<ProductDto> {
    try {
      return Product.toDto(await this.productService.update(id, updateProduct));
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Patch(':id')
  @ApiBody({ type: ProductDto })
  @ApiOkResponse({ type: ProductDto, description: 'Update product' })
  @ApiNotFoundResponse({ description: 'Product not found in database' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async patchOne(
    @Param('id') id: string,
    @Body() patchProduct: Partial<ProductDto>,
  ): Promise<ProductDto> {
    try {
      return Product.toDto(await this.productService.update(id, patchProduct));
    } catch (err) {
      this.handleError(err, err.status);
    }
  }

  @Delete(':id')
  @HttpCode(202)
  @ApiResponse({ status: 202, description: 'Delete product', type: '' })
  @ApiNotFoundResponse({ description: 'Product not found in database' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  deleteOne(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
