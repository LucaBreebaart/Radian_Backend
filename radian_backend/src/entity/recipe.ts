import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredients";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @ManyToMany(() => Ingredient, ingredient => ingredient.recipes)
    @JoinTable()
    ingredients!: Ingredient[]
    
    
    
    // link to ingredient primary key
    // this will hold the 5 ingredients

}

