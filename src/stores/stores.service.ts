import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return await this.storesRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!store) {
      throw new NotFoundException(`Tienda con el ID ${id} no existe`);
    }
    return store;
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { name, city, address } = createStoreDto;

    if (!/^[A-Z]{3}$/.test(city)) {
      throw new BadRequestException('Codigo de ciudad invalido');
    }

    const store = this.storesRepository.create({ name, city, address });
    return await this.storesRepository.save(store);
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const { name, city, address } = updateStoreDto;

    if (city && !/^[A-Z]{3}$/.test(city)) {
      throw new BadRequestException('Codigo de ciudad invalido');
    }

    await this.storesRepository.update(id, updateStoreDto);
    const updatedStore = await this.findOne(id);
    return updatedStore;
  }

  async delete(id: number): Promise<void> {
    const result = await this.storesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tienda con el ID ${id} no existe`);
    }
  }
}
