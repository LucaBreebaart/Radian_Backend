import  express from "express";
import AppDataSource from "../dataSource";
import { Recipe } from "../entity/recipe";


const recipeRouter = express.Router()

recipeRouter.use(express.json())

const appDataSource = AppDataSource

recipeRouter.get("/", async (req, res) => {

    try{

        const recipes = await appDataSource.getRepository(Recipe).createQueryBuilder("recipes")
                            .leftJoinAndSelect("recipes.ingredients", "ingredient")
                            .leftJoinAndSelect("ingredient.inventory", "inventory")
                            .getMany()

    } catch (error){
        console.log("an error has occured")
        return res.status(500).json({message: error})
    }
})

export default recipeRouter