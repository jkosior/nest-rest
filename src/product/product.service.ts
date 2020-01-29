import { Product } from '@entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, DeleteResult } from 'typeorm';
import { ProductDto, Price, CreateProductDto } from './product.dto';
import { Catch } from '@server/cach.decorator';
import { CurrencyService } from '@currency/currency.service';
import { AbstractService } from '@server/abstracts/abstract.service';
import { Injectable } from '@nestjs/common';
import { CartProduct, AddCartProduct } from '@cart/cart.dto';

@Injectable()
export class ProductService extends AbstractService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly currencyService: CurrencyService,
  ) {
    super();
    this.name = 'Product';
  }

  @Catch()
  getAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  @Catch()
  async getOne(id: string): Promise<Product> {
    try {
      return await this.findById(id);
    } catch (err) {
      this.throwNotFound();
    }
  }

  @Catch()
  async getPriceInCurrency(id: string, currency: string): Promise<Price> {
    const product = await this.getOne(id);
    const productHasCurrency = product.price.find(
      value => value.name === currency,
    );

    if (!productHasCurrency) {
      const [priceValue] = product.price;
      const priceInCurrency = await this.currencyService.fromTo(
        priceValue.name,
        currency,
        priceValue.value,
      );
      const priceToSave: Price = {
        name: currency,
        value: priceInCurrency,
      };
      product.price.push(priceToSave);
      await this.save(product);
    }

    return product.price.find(price => price.name === currency);
  }

  @Catch()
  async create(toCreate: CreateProductDto): Promise<Product> {
    if (toCreate.price.length === 0) {
      throw new Error('At least one price must be set');
    }

    const exists = await this.checkIfExists(null, {
      where: { name: toCreate.name },
    });

    if (exists) {
      this.throwAlreadyExists();
    }

    const product = this.productRepository.create(toCreate);
    return await this.save(product);
  }

  @Catch()
  async update(
    id: string,
    toUpdate: ProductDto | Partial<ProductDto>,
  ): Promise<Product> {
    const exists = await this.checkIfExists(id);

    if (!exists) {
      this.throwNotFound();
    }

    await this.productRepository.update(id, toUpdate);
    const foundProduct = await this.getOne(id);
    return foundProduct;
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
  async checkAvailability(product: AddCartProduct): Promise<boolean> {
    const foundProduct = await this.getOne(product.id);
    if (foundProduct.quantity >= product.quantity) {
      foundProduct.quantity -= product.quantity;
      await this.save(foundProduct);
      return true;
    }

    return false;
  }

  @Catch()
  async handleProductRemovedFromCart(product: CartProduct) {
    const foundProduct = await this.getOne(product.id);
    foundProduct.quantity += product.quantity;
    await this.save(foundProduct);
  }

  @Catch()
  private async save(product: Product) {
    return this.productRepository.save(product);
  }

  @Catch()
  protected async findByOptions(
    options: FindOneOptions<Product>,
  ): Promise<Product> {
    return this.productRepository.findOne(options);
  }

  @Catch()
  protected async findById(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }
}
