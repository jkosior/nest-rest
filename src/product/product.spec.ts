import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as supertest from 'supertest';
import { resolve } from 'path';
import { ProductModule } from './product.module';
import { testProduct, testProduct2 } from '../testData/mockProducts';

dotenv.config();

let testProductId: string;

describe('[PRODUCT]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
          resolve(__dirname, '../config', '**/!(*.d).config.{ts,js}'),
          {
            modifyConfigName: name => name.replace('.config', ''),
          },
        ),
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
      const { body, status } = await supertest(app.getHttpServer()).get(
        '/product',
      );

      expect(body).toBeInstanceOf(Array);
      expect(status).toEqual(200);
    });
  });

  describe('[POST /product]', () => {
    it('should add product to database', async () => {
      const { body } = await supertest(app.getHttpServer())
        .post('/product')
        .send(testProduct);

      expect(body).toHaveProperty('id');
      testProductId = body.id;

      expect(body).toHaveProperty('name', testProduct.name);
      expect(body).toHaveProperty('quantity', testProduct.quantity);
      expect(body).toHaveProperty('price', testProduct.price);
    });
  });

  describe('[GET /product/id]', () => {
    it('should return existing product', async () => {
      const { body } = await supertest(app.getHttpServer()).get(
        `/product/${testProductId}`,
      );

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name', testProduct.name);
      expect(body).toHaveProperty('quantity', testProduct.quantity);
      expect(body).toHaveProperty('price', testProduct.price);
    });

    it('should not return non-existing product', async () => {
      const { status } = await supertest(app.getHttpServer()).get(`/product/2`);

      expect(status).toEqual(404);
    });
  });

  describe('[PUT /product]', () => {
    it('should add product to database', async () => {
      const { body } = await supertest(app.getHttpServer())
        .put(`/product/${testProductId}`)
        .send(testProduct2);

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name', testProduct2.name);
      expect(body).toHaveProperty('quantity', testProduct2.quantity);
      expect(body).toHaveProperty('price', testProduct2.price);
    });
  });

  describe('[PATCH /product]', () => {
    it('should add product to database', async () => {
      const { body } = await supertest(app.getHttpServer())
        .patch(`/product/${testProductId}`)
        .send({ quantity: 10 });

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name', testProduct2.name);
      expect(body).toHaveProperty('quantity', 10);
      expect(body).toHaveProperty('price', testProduct2.price);
    });
  });

  describe('[DELETE /product/id]', () => {
    it('should add product to database', async () => {
      const { status } = await supertest(app.getHttpServer()).delete(
        `/product/${testProductId}`,
      );
      expect(status).toEqual(202);
    });
  });
});
