import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';


describe('StoresService', () => {
  let service: StoresService;
  let repository: Repository<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
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

    service = module.get<StoresService>(StoresService);
    repository = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  describe('findAll', () => {
    it('should return an array of stores', async () => {
      const result = [new Store()];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a store by ID', async () => {
      const id = 1;
      const store = new Store();
      jest.spyOn(repository, 'findOne').mockResolvedValue(store);

      expect(await service.findOne(id)).toBe(store);
    });

    it('should throw a NotFoundException if store is not found', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new store', async () => {
      const createStoreDto = { name: 'Test Store', city: 'BOG', address: 'Test Address' };
      const store = new Store();
      jest.spyOn(repository, 'save').mockResolvedValue(store);

      expect(await service.create(createStoreDto)).toBe(store);
    });

    it('should throw a BadRequestException for an invalid city code', async () => {
      const createStoreDto = { name: 'Test Store', city: 'Invalid', address: 'Test Address' };

      await expect(service.create(createStoreDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update and return the updated store', async () => {
      const id = 1;
      const updateStoreDto = { name: 'Updated Store', city: 'MED', address: 'Updated Address' };
      const store = new Store();
      jest.spyOn(repository, 'findOne').mockResolvedValue(store);
      jest.spyOn(repository, 'save').mockResolvedValue(store);

      expect(await service.update(id, updateStoreDto)).toBe(store);
    });

    it('should throw a NotFoundException if store is not found', async () => {
      const id = 1;
      const updateStoreDto = { name: 'Updated Store', city: 'MED', address: 'Updated Address' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.update(id, updateStoreDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException for an invalid city code', async () => {
      const id = 1;
      const updateStoreDto = { name: 'Updated Store', city: 'Invalid', address: 'Updated Address' };

      await expect(service.update(id, updateStoreDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete the store', async () => {
      const id = 1;
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      await service.delete(id);

      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException if store is not found', async () => {
      const id = 1;
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
