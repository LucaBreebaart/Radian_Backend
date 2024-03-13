import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe";

@Entity()
export class Ingredients {
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
}

