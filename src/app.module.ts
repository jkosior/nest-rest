import { Module } from '@nestjs/common';
import { ConfigModule, Config, ConfigService } from 'nestjs-config';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { CronModule } from '@cron/cron.module';
import { resolve } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).config.{ts,js}'), {
      modifyConfigName: name => name.replace('.config', ''),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    CronModule,
    CartModule,
    ProductModule,
  ],
})
export class AppModule {}
