import { Currency } from '@entities/currency.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyService } from './currency.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Currency,
    ]),
  ],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
