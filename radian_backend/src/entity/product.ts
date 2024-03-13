import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe";


@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    sku!: string

    @Column()
    price!: number

    @Column()
    category!: string

    @Column()
    icon!: string

    @Column()
    description!: string

    @OneToOne(() => Recipe)
    @JoinColumn()
    recipe_id!: Recipe

    // https://typeorm.io/relations <-- Lets have a look at this so that we can do relations


    //Recipe ID -> connects to Recipe ->  
    // which holds 5 ingredients -> 
    // which links to ingredient 
    
}

