import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe";
import { Warehouse } from "./warehouses";

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

    @ManyToMany(() => Recipe, recipe => recipe.ingredients)
    recipes!: Recipe[]

    @ManyToMany(() => Warehouse, warehouse => warehouse.ingredients)
    @JoinTable()
    warehouses!: Warehouse[]
}

