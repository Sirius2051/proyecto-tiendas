import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @ManyToMany(() => Product, product => product.stores)
  @JoinTable()
  products: Product[];
}
