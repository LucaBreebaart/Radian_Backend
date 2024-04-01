import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    img!: string

    @Column()
    price!: number

    @Column()
    description!: string

    @Column()
    amountCrafted!: number

    //recipe can have an array of ingredients from ingredient entity
    @OneToMany(() => Product, products => products.recipe)
    products?: Product[]
}

