import { Product } from '@entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './product.dto';
import { Catch } from '@server/cach.decorator';

export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  @Catch()
  async getAll(): Promise<ProductDto[]> {
    const products = await this.productRepository.find();
    return products.map(product => Product.toDto(product));
  }

  @Catch()
  async getOne(id: string): Promise<ProductDto> {
    const product = await this.productRepository.findOne(id);
    return Product.toDto(product);
  }

  @Catch()
  async create(toCreate: ProductDto): Promise<Product> {
    const product = this.productRepository.create(toCreate);
    return this.productRepository.save(product);
  }

  @Catch()
  async update(id: string, toUpdate: ProductDto): Promise<ProductDto> {
    await this.productRepository.update(id, toUpdate);
    const foundProduct = await this.productRepository.findOne(id);
    return Product.toDto(foundProduct);
  }

  @Catch()
  delete(toDelete: string) {
    this.productRepository.delete(toDelete);
  }
}
