import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '@entities/currency.entity';
import { Repository } from 'typeorm';
import { CurrencyDto } from './currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly repository: Repository<Currency>,
  ) {}

  getCurrencies(): Promise<Currency[]> {
    return this.repository.find();
  }

  getOneByName(name: string): Promise<Currency> {
    return this.repository.findOne({ name });
  }

  async updateOrInsert(value: CurrencyDto) {
    const currencyExists = await this.getOneByName(value.name);

    if (typeof currencyExists === 'undefined') {
      const currency = this.repository.create(value);
      await this.repository.save(currency);
    } else {
      await this.repository.update({ name: value.name }, value);
    }
  }

  async fromTo(
    fromName: string,
    toName: string,
    price: number,
  ): Promise<number> {
    const from = await this.getOneByName(fromName);
    const to = await this.getOneByName(toName);

    if (typeof from === 'undefined') {
      return null;
    }

    if (typeof to === 'undefined') {
      return null;
    }

    const rate = this.calculateRate(from.rate, to.rate);
    return price * rate;
  }

  private calculateRate(fromRate: number, toRate: number): number {
    return parseFloat((fromRate / toRate).toFixed(4));
  }
}
