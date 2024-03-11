import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    amount!: number
}

