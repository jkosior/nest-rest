import { Test } from '@nestjs/testing';
import { CurrencyModule } from './currency.module';
import { CurrencyService } from './currency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';

dotenv.config();

describe('[CURRENCY]', () => {
  let service: CurrencyService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(resolve(__dirname, '../config', '**/!(*.d).config.{ts,js}'), {
          modifyConfigName: name => name.replace('.config', ''),
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
        }),
        CurrencyModule,
      ]
    })
    .compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  describe('Get all currencies', () => {
    it('should return an array of currencies', async () => {
      const response = await service.getCurrencies();
      expect(response).toBeInstanceOf(Array);
      expect(response.length).not.toEqual(0);
    });
  });

  describe('Get one', () => {

    it('should return details of currency', async () => {
      const response = await service.getOneByName('USD');
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', 'USD');
      expect(response).toHaveProperty('rate');
    });

    it('should not return details not known currency', async () => {
      const response = await service.getOneByName('AFK');
      expect(response).toBeUndefined();
    });

  });

  describe('Calculate rate', () => {
    it('should calculate rates of two existing currencies', async () => {
      const response = await service.fromTo('USD', 'EUR', 1);
      expect(response).toBeGreaterThan(1);
    });

    it('should not calculate rates not existing currencies', async () => {
      const response = await service.fromTo('USD', 'AFK', 1);
      expect(response).toBeNull();
    });
  });

});
