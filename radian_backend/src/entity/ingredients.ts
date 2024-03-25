import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Warehouse } from "./warehouses";
import { Product } from "./products";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    category!: string

    @Column()
    icon!: string

    @Column()
    description!: string

    @Column()
    stock!: number

    @OneToMany(() => Product, products => products.ingredients)
    public ingredientsToCraftables?: Product[];

    // @ManyToMany(() => Warehouse, warehouse => warehouse.ingredients)
    // @JoinTable()
    // warehouses!: Warehouse[]
}

