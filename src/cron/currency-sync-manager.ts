import { Injectable } from '@nestjs/common';
import { NestSchedule, Timeout, Cron } from 'nest-schedule';
import axios from 'axios';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class CurrencySyncManager extends NestSchedule {
  private readonly apiPath: string = 'https://api.exchangeratesapi.io/latest';

  constructor(private readonly currencyService: CurrencyService) {
    super();
  }

  @Cron('0 0 0 * *', {
    startTime: new Date(),
  }) // run every midnight
  async updateData() {
    await this.processCurrencies();
  }

  @Timeout(1000) // run on start
  async updateDataOnStart() {
    await this.processCurrencies();
  }

  private async processCurrencies() {
    const { data } = await axios.get(this.apiPath);
    await this.currencyService.updateOrInsert({ name: 'EUR', rate: 1 });
    for (const rateName in data.rates) {
      if (typeof rateName === 'string') {
        await this.currencyService.updateOrInsert({
          name: rateName,
          rate: data.rates[rateName],
        });
      }
    }
  }
}
