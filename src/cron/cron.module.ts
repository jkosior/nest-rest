import { Module } from '@nestjs/common';
import { CurrencySyncManager } from './currency-sync-manager';
import { CurrencyService } from 'src/currency/currency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '@entities/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Currency,
    ]),
  ],
  providers: [
    CurrencyService,
    CurrencySyncManager,
  ],
})
export class CronModule {}
