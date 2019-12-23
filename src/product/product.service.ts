import { Product } from '@entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto, PriceDto } from './product.dto';
import { Catch } from '@server/cach.decorator';
import { CurrencyService } from '@currency/currency.service';
import e = require('express');


export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly currencyService: CurrencyService,
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

  async productsCheckout(products: ProductDto[], currencyName: string): Promise<PriceDto[]> {
    const prices: PriceDto[] = [];
    for (const product of products) {
      const productHasCurrency = product.price.find((value) => value.name === currencyName);

      if (typeof productHasCurrency !== 'undefined') {
        prices.push(productHasCurrency);
      } else {
        const [price] = product.price;
        const valueInCurrency: number = await this.currencyService.fromTo(price.name, currencyName, price.value);
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
}
