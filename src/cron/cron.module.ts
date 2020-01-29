import { CurrencyModule } from '@currency/currency.module';
import { Module } from '@nestjs/common';
import { CurrencySyncManager } from './currency-sync-manager';

@Module({
  imports: [CurrencyModule],
  providers: [CurrencySyncManager],
})
export class CronModule {}
