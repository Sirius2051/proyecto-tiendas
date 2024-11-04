import { Test, TestingModule } from '@nestjs/testing';
import { ProductsStoresService } from './products-stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Store } from '../stores/entities/store.entity';
import { Repository, In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsStoresService', () => {
  let service: ProductsStoresService;
  let productRepository: Repository<Product>;
  let storeRepository: Repository<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsStoresService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Store),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsStoresService>(ProductsStoresService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  describe('addStoreToProduct', () => {
    it('should add a store to a product', async () => {
      const product = new Product();
      product.stores = [];
      const store = new Store();

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(store);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      await service.addStoreToProduct(1, 1);

      expect(productRepository.save).toHaveBeenCalled();
      expect(product.stores).toContain(store);
    });

    it('should throw NotFoundException if product or store is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.addStoreToProduct(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findStoresFromProduct', () => {
    it('should return stores from a product', async () => {
      const product = new Product();
      product.stores = [new Store(), new Store()];

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      const result = await service.findStoresFromProduct(1);

      expect(result).toBe(product.stores);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findStoresFromProduct(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findStoreFromProduct', () => {
    it('should return a store from a product', async () => {
      const store = new Store();
      store.id = 1;
      const product = new Product();
      product.stores = [store];

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      const result = await service.findStoreFromProduct(1, 1);

      expect(result).toBe(store);
    });

    it('should throw NotFoundException if store is not found in product', async () => {
      const product = new Product();
      product.stores = [];

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      await expect(service.findStoreFromProduct(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findStoreFromProduct(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStoresFromProduct', () => {
    it('should update stores from a product', async () => {
      const product = new Product();
      product.stores = [];
      const stores = [new Store(), new Store()];
  
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(storeRepository, 'find').mockResolvedValue(stores);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);
  
      await service.updateStoresFromProduct(1, [1, 2]);
  
      expect(productRepository.save).toHaveBeenCalled();
      expect(product.stores).toEqual(stores);
    });
  
    it('should throw NotFoundException if product or stores are not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);
  
      await expect(service.updateStoresFromProduct(1, [1, 2])).rejects.toThrow(NotFoundException);
    });
  });
  
  

  describe('deleteStoreFromProduct', () => {
    it('should delete a store from a product', async () => {
      const store = new Store();
      store.id = 1;
      const product = new Product();
      product.stores = [store];

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      await service.deleteStoreFromProduct(1, 1);

      expect(productRepository.save).toHaveBeenCalled();
      expect(product.stores).not.toContain(store);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.deleteStoreFromProduct(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
