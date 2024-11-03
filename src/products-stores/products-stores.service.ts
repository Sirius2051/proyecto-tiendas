import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Store } from '../stores/entities/store.entity';

@Injectable()
export class ProductsStoresService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async addStoreToProduct(productId: number, storeId: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    const store = await this.storesRepository.findOne({
      where: { id: storeId },
    });
  
    if (!product || !store) {
      throw new NotFoundException('Producto o tienda no encontrado');
    }
  
    product.stores.push(store);
    await this.productsRepository.save(product);
  }
  

  async findStoresFromProduct(productId: number): Promise<Store[]> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product.stores;
  }

  async findStoreFromProduct(productId: number, storeId: number): Promise<Store> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    const store = product?.stores.find(store => store.id === storeId);

    if (!store) {
      throw new NotFoundException('Tienda no encontrada para el producto');
    }

    return store;
  }

  async updateStoresFromProduct(productId: number, storeIds: number[]): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    const stores = await this.storesRepository.find({
      where: { id: In(storeIds) },
    });
  
    if (!product || stores.length !== storeIds.length) {
      throw new NotFoundException('Producto o tiendas no encontrados');
    }
  
    product.stores = stores;
    await this.productsRepository.save(product);
  }
  
  

  async deleteStoreFromProduct(productId: number, storeId: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    product.stores = product.stores.filter(store => store.id !== storeId);
    await this.productsRepository.save(product);
  }
}
