//  Create a post enpoint to create our users
// create a post enpoint for login

import Express from "express";
import AppDataSource from "../dataSource";
import { User } from "../entity/user";

import * as bcrypt from 'bcrypt';

const usereRouter = Express.Router();

usereRouter.use(Express.json());

const appDataSource = AppDataSource;

usereRouter.post("/", async (req, res) => {

    try {

        const { username, email, password, years, isAdmin } = req.body

        var newUser = new User()
        newUser.username = username
        newUser.email = email
        newUser.password = password
        newUser.years = years
        newUser.isAdmin = isAdmin

        var addedUser = await appDataSource.getRepository(User).save(newUser)

        return res.json(addedUser)

    } catch (error) {
        console.log("error occured" + error)
        return res.status(500).json({ message: error });
    }
})

// create endpoint for login

usereRouter.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email && password) {

            let usereRequest = await appDataSource.getRepository(User).findOneBy({ email: email })

            if (!usereRequest) {
                return res.status(404).json({ message: "no user found" })
            } else {

                bcrypt.compare(password, usereRequest.password, (error, result) => {
                    if (result) {
                        usereRequest!.password="" //to not expose the password when returns in the console
                        return res.json(usereRequest)
                    } else {
                        return res.status(500).json({ message: "Invalid Credentials" })
                    }
                })
            }
        } else {
            return res.status(500).json({ message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log("message:" + error)
        return res.status(500).json({ message: error })
    }

})

export default usereRouter