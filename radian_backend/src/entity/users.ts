import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Users{
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string 

    @Column()
    surname!: string 

    @Column()
    email!: string

    @Column()
    password!: string

    @Column()
    phone_no!: number
}