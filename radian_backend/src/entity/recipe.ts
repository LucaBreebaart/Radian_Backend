import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number

    // link to ingredient primary key
    // this will hold the 5 ingredients

}

