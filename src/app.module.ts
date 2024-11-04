import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { ProductsStoresModule } from './products-stores/products-stores.module';
import { Product } from './products/entities/product.entity';
import { Store } from './stores/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductsModule,
    StoresModule,
    ProductsStoresModule,
  ],
})
export class AppModule {}
