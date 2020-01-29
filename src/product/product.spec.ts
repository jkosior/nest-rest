import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as supertest from 'supertest';
import { resolve } from 'path';
import { ProductModule } from './product.module';
import { INestApplication } from '@nestjs/common';

dotenv.config();

describe('[PRODUCT]', () => {
  let app: INestApplication;

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
        ProductModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET /product]', () => {
    it('should return array of products', async () => {
      const { body, status } = await supertest(app.getHttpServer())
        .get('/product');

      expect(body).toBeInstanceOf(Array);
      expect(status).toEqual(200);

    });
  });

});