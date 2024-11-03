import { Module } from '@nestjs/common';
import { ProductsStoresService } from './products-stores.service';

@Module({
  providers: [ProductsStoresService],
})
export class ProductsStoresModule {}
