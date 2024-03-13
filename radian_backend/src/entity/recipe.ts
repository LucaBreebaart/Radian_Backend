import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredients } from "./ingredients";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @ManyToMany(() => Ingredients, ingredient => ingredient.recipes)
    @JoinTable()
    ingredients!: Ingredients[]
    // link to ingredient primary key
    // this will hold the 5 ingredients

}

