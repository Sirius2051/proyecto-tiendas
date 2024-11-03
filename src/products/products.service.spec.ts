import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
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
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [new Product()];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const id = 1;
      const product = new Product();
      jest.spyOn(repository, 'findOne').mockResolvedValue(product);

      expect(await service.findOne(id)).toBe(product);
    });

    it('should throw a NotFoundException if product is not found', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createProductDto = { name: 'Test Product', price: 10.0, type: 'Perecedero' };
      const product = new Product();
      jest.spyOn(repository, 'save').mockResolvedValue(product);

      expect(await service.create(createProductDto)).toBe(product);
    });

    it('should throw a BadRequestException for an invalid product type', async () => {
      const createProductDto = { name: 'Test Product', price: 10.0, type: 'Invalid Type' };

      await expect(service.create(createProductDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const id = 1;
      const updateProductDto = { name: 'Updated Product', type: 'No perecedero' };
      const product = new Product();
      jest.spyOn(repository, 'findOne').mockResolvedValue(product);
      jest.spyOn(repository, 'save').mockResolvedValue(product);

      expect(await service.update(id, updateProductDto)).toBe(product);
    });

    it('should throw a NotFoundException if product is not found', async () => {
      const id = 1;
      const updateProductDto = { name: 'Updated Product', type: 'No perecedero' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.update(id, updateProductDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException for an invalid product type', async () => {
      const id = 1;
      const updateProductDto = { name: 'Updated Product', type: 'Invalid Type' };

      await expect(service.update(id, updateProductDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete the product', async () => {
      const id = 1;
      const deleteResult = { affected: 1, raw: [] };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      await service.delete(id);

      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException if product is not found', async () => {
      const id = 1;
      const deleteResult = { affected: 0, raw: [] };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
