import { Product } from '@entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, DeleteResult } from 'typeorm';
import { ProductDto, PriceDto, CreateProductDto } from './product.dto';
import { Catch } from '@server/cach.decorator';
import { CurrencyService } from '@currency/currency.service';
import { AbstractService } from '@server/abstracts/abstract.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService extends AbstractService<Product> {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly currencyService: CurrencyService,
  ) {
    super();
    this.name = 'Product';
  }

  @Catch()
  async getAll(): Promise<ProductDto[]> {
    const products = await this.productRepository.find();
    return products.map(product => Product.toDto(product));
  }

  @Catch()
  async getOne(id: string): Promise<ProductDto> {
    const product = await this.findById(id);
    return Product.toDto(product);
  }

  @Catch()
  async create(toCreate: CreateProductDto): Promise<ProductDto> {
    if (toCreate.price.length === 0) {
      throw new Error('At least one price must be set');
    }

    const exists = await this.checkIfExists(null, { where: { name: toCreate.name }});

    if (exists) {
      this.throwNotFound();
    }

    const product = this.productRepository.create(toCreate);
    return this.productRepository.save(product);
  }

  @Catch()
  async update(id: string, toUpdate: ProductDto | Partial<ProductDto>): Promise<ProductDto> {
    const exists = await this.checkIfExists(id);

    if (!exists) {
      this.throwNotFound();
    }

    await this.productRepository.update(id, toUpdate);
    const foundProduct = await this.productRepository.findOne(id);
    return Product.toDto(foundProduct);
  }

  @Catch()
  async delete(toDeleteId: string): Promise<DeleteResult> {
    const exists = await this.checkIfExists(toDeleteId);
    if (!exists) {
      this.throwNotFound();
    }
    const result = this.productRepository.delete(toDeleteId);
    return result;
  }

  @Catch()
  async productsCheckout(products: ProductDto[], currencyName: string): Promise<PriceDto[]> {
    const prices: PriceDto[] = [];
    for (const product of products) {
      const productHasCurrency = product.price.find((value) => value.name === currencyName);

      if (typeof productHasCurrency !== 'undefined') {
        prices.push(productHasCurrency);
      } else {
        const [priceValue] = product.price;
        const valueInCurrency: number = await this.currencyService.fromTo(priceValue.name, currencyName, priceValue.value);
        const priceToSave: PriceDto = {
          name: currencyName,
          value: valueInCurrency,
        };

        product.price.push(priceToSave);

        await this.productRepository.update(product.name, product);
        prices.push(priceToSave);
      }
    }

    return prices;
  }

  @Catch()
  protected async findByOptions(options: FindOneOptions<Product>): Promise<Product> {
    return this.productRepository.findOne(options);
  }

  @Catch()
  protected async findById(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }
}
