import { Controller, Post, Get, Param, Delete, Put, Body } from '@nestjs/common';
import { ProductsStoresService } from './products-stores.service';
import { Store } from '../stores/entities/store.entity';

@Controller('products/:productId/stores')
export class ProductsStoresController {
  constructor(private readonly productsStoresService: ProductsStoresService) {}

  @Post(':storeId')
  async addStoreToProduct(@Param('productId') productId: number, @Param('storeId') storeId: number) {
    return this.productsStoresService.addStoreToProduct(productId, storeId);
  }

  @Get()
  async findStoresFromProduct(@Param('productId') productId: number): Promise<Store[]> {
    return this.productsStoresService.findStoresFromProduct(productId);
  }

  @Get(':storeId')
  async findStoreFromProduct(@Param('productId') productId: number, @Param('storeId') storeId: number): Promise<Store> {
    return this.productsStoresService.findStoreFromProduct(productId, storeId);
  }

  @Put()
  async updateStoresFromProduct(@Param('productId') productId: number, @Body('storeIds') storeIds: number[]) {
    return this.productsStoresService.updateStoresFromProduct(productId, storeIds);
  }

  @Delete(':storeId')
  async deleteStoreFromProduct(@Param('productId') productId: number, @Param('storeId') storeId: number) {
    return this.productsStoresService.deleteStoreFromProduct(productId, storeId);
  }
}

