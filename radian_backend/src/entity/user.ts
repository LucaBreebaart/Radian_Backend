import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

// use the table called "users"
@Entity("users")
export class User { //user is reserved postgres
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    username: string = "placeholder"

    @Column()
    email: string = "email@email.com"

    @Column()
    password!: string

    @Column()
    years: number = 1

    @Column()
    isAdmin: boolean = false


    // before Insert run sth ecode when ever calling getRepository.save()
    @BeforeInsert()
    async handlePassword(): Promise<void> {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    //npm install bcrypt
    //npm install --save-dev @types/bcrypt

}