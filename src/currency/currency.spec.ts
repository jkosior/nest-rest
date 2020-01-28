import { CurrencyService } from './currency.service';
import { Test } from '@nestjs/testing';
import { CurrencyModule } from './currency.module';
import { INestApplication } from '@nestjs/common';

describe('[CURRENCY]', () => {
  let currencyService: CurrencyService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CurrencyModule],
    })
    .compile();

    currencyService = module.get(CurrencyService);
  })

  describe('findAll', () => {
    it('should return an array of currencies', async() => {
      const response = await currencyService.getCurrencies();
      console.log(response)
    })
  })
})