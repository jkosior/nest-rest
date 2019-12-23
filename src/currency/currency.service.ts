import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '@entities/currency.entity';
import { Repository } from 'typeorm';
import { CurrencyDto } from './currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency) private readonly repository: Repository<Currency>,
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

  async fromTo(fromName: string, toName: string): Promise<number> {
    const from = await this.getOneByName(fromName);
    const to = await this.getOneByName(toName);

    const rate = from.rate * to.rate;
    return rate;
  }
}
