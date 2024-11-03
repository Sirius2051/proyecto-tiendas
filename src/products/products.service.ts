import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({ relations: ['stores'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con el ID ${id} no encontrado`);
    }
    return product;
  }
  

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, type } = createProductDto;

    if (!['Perecedero', 'No perecedero'].includes(type)) {
      throw new BadRequestException('Tipo de producto invalido');
    }

    const product = this.productsRepository.create({ name, price, type });
    return await this.productsRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { name, price, type } = updateProductDto;

    if (type && !['Perecedero', 'No perecedero'].includes(type)) {
      throw new BadRequestException('Tipo de producto invalido');
    }

    await this.productsRepository.update(id, updateProductDto);
    const updatedProduct = await this.findOne(id);
    return updatedProduct;
  }

  async delete(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con el ID ${id} no encontrado`);
    }
  }
}
