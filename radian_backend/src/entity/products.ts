import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe";
import { Ingredient } from "./ingredients";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    public productId!: number

    @Column()
    public recipeId!: number

    @Column()
    public inventoryId!: number

    @Column()
    public amount!: number

    @ManyToOne(() => Ingredient, (ingredients) => ingredients.ingredientsToCraftables)
    public ingredients?: Ingredient

    @ManyToOne(() => Recipe, (recipe) => recipe.products)
    public recipe?: Recipe
}

