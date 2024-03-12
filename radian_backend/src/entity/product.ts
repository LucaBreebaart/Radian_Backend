import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Products {
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

    //Recipe ID -> connects to Recipe ->  
    // which holds 5 ingredients -> 
    // which links to ingredient 
    
}

