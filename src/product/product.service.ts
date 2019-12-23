import { Product } from '@entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './product.dto';

export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  getAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  getOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }

  create(toCreate: ProductDto): Promise<Product> {
    const product = this.productRepository.create(toCreate);
    return this.productRepository.save(product);
  }

  async update(id: string, toUpdate: ProductDto): Promise<Product> {
    await this.productRepository.update(id, toUpdate);
    return this.productRepository.findOne(id);
  }

  delete(toDelete: string) {
    this.productRepository.delete(toDelete);
  }
}
