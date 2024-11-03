import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  type: string;

  @ManyToMany(() => Store, store => store.products)
  stores: Store[];
}
