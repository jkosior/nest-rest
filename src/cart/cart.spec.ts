import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as supertest from 'supertest';
import { resolve } from 'path';
import { INestApplication } from '@nestjs/common';
import { CartModule } from './cart.module';
import { testCart } from '../testData/mockCart';
import { testProduct3, testProduct4 } from '../testData/mockProducts';
import { ProductDto } from '@product/product.dto';
import { CartService } from './cart.service';

dotenv.config();

let testCartId: string;
const testCurrency: string = 'GBP';

describe('[CART]', () => {
  let app: INestApplication;
  let cartService: CartService;
  let productArray: ProductDto[];

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
        CartModule,
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    app = module.createNestApplication();
    await app.init();

    const response1 = await supertest(app.getHttpServer())
      .post('/product')
      .send(testProduct3);
    const response2 = await supertest(app.getHttpServer())
      .post('/product')
      .send(testProduct4);
    productArray = [response1.body, response2.body];
  });

  describe('[POST /cart]', () => {
    it('should create a cart', async () => {
      const { body, status } = await supertest(app.getHttpServer())
        .post('/cart')
        .send(testCart);

      expect(status).toEqual(201);
      expect(body).toHaveProperty('id');
      testCartId = body.id;

      expect(body).toHaveProperty('owner', testCart.owner);
      expect(body).toHaveProperty('currency', testCart.currency);
    });
  });

  describe('[GET /cart/id]', () => {
    it('should retur a cart', async () => {
      const { body, status } = await supertest(app.getHttpServer()).get(
        `/cart/${testCartId}`,
      );

      expect(status).toEqual(200);
      expect(body).toHaveProperty('id', testCartId);
      expect(body).toHaveProperty('owner', testCart.owner);
      expect(body).toHaveProperty('currency', testCart.currency);
    });
  });

  describe('[PUT /cart/id/add]', () => {
    it('should add product to cart', async () => {
      const { id } = productArray[0];
      const { body, status } = await supertest(app.getHttpServer())
        .put(`/cart/${testCartId}/add`)
        .send({ product: { id, quantity: 3 } });

      expect(status).toEqual(200);
      expect(body).toHaveProperty('id', testCartId);
      expect(body).toHaveProperty('owner', testCart.owner);
      expect(body).toHaveProperty('products');
      expect(body.products).toBeInstanceOf(Array);
      expect(body.products.length).toEqual(1);
      expect(body).toHaveProperty('currency', testCart.currency);
    });

    it('should not add product to cart with too high quantity', async () => {
      const { id } = productArray[0];
      const { body, status } = await supertest(app.getHttpServer())
        .put(`/cart/${testCartId}/add`)
        .send({ product: id, quantity: 20 });

      expect(status).toEqual(400);
      expect(body).toHaveProperty(
        'message',
        'Product is not available in given quantity',
      );
    });

    it('should add another product to cart', async () => {
      const { id } = productArray[1];
      const { body, status } = await supertest(app.getHttpServer())
        .put(`/cart/${testCartId}/add`)
        .send({ product: { id, quantity: 10 } });

      expect(status).toEqual(200);
      expect(body).toHaveProperty('id', testCartId);
      expect(body).toHaveProperty('owner', testCart.owner);
      expect(body).toHaveProperty('products');
      expect(body.products).toBeInstanceOf(Array);
      expect(body.products.length).toEqual(2);
      expect(body).toHaveProperty('currency', testCart.currency);
    });
  });

  describe('[PUT /cart/id/remove/id]', () => {
    it('should remove product from database', async () => {
      const { id } = productArray[1];
      const { body, status } = await supertest(app.getHttpServer()).put(
        `/cart/${testCartId}/remove/${id}`,
      );
      expect(status).toEqual(200);
      expect(body).toHaveProperty('id', testCartId);
      expect(body).toHaveProperty('owner', testCart.owner);
      expect(body).toHaveProperty('products');
      expect(body.products).toBeInstanceOf(Array);
      expect(body.products.length).toEqual(1);
      expect(body).toHaveProperty('currency', testCart.currency);
    });
  });

  describe('[POST /cart/id/checkout]', () => {
    it('should calculate all the prices and send total as an output', async () => {
      const { body, status } = await supertest(app.getHttpServer()).post(
        `/cart/${testCartId}/checkout?currency=${testCurrency}`,
      );
      expect(status).toEqual(201);
      expect(body).toHaveProperty('id', testCartId);
      expect(body).toHaveProperty('owner', testCart.owner);
      expect(body).toHaveProperty('products');
      expect(body.products).toBeInstanceOf(Array);
      expect(body.products.length).toEqual(1);
      expect(body).toHaveProperty('currency', testCurrency);
      expect(body.isCheckedOut).toBeTruthy();
    });
  });

  afterAll(async () => {
    await supertest(app.getHttpServer()).delete(
      `/product/${productArray[0].id}`,
    );
    await supertest(app.getHttpServer()).delete(
      `/product/${productArray[1].id}`,
    );
    cartService.deleteCart(testCartId);
    await app.close();
  });
});
