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
    username!: string

    @Column()
    password!: string

    @Column()
    email!: string

    @Column()
    dateofbirth!: string

    @Column()
    gender!: string

    @Column()
    img!: string

    @Column()
    phone_no!: number

}