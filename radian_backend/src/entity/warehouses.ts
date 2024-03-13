import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredients";


@Entity()
export class Warehouse {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    Address!: String

    @ManyToMany(() => Ingredient, ingredient => ingredient.warehouses)
    @JoinTable()
    ingredients!: Ingredient[]
}