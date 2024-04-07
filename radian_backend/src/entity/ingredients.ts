import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({default: 'sku01'})
    sku?: string

    @Column()
    category!: string

    @Column()
    icon!: string

    @Column()
    description!: string

    @Column({default: 0})
    stock!: number

    @Column({ default: 0 }) 
    durban!: number;

    @Column({ default: 0 })
    pretoria!: number;

    @Column({ default: 0 })
    capeTown!: number;

    @OneToMany(() => Product, products => products.ingredients)
    public ingredientsToCraftables?: Product[];
}

