import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsStoresService } from './products-stores.service';
import { ProductsStoresController } from './products-stores.controller';
import { Product } from '../products/entities/product.entity';
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Store])],
  providers: [ProductsStoresService],
  controllers: [ProductsStoresController],
})
export class ProductsStoresModule {}
