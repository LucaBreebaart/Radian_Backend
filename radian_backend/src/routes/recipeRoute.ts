import  express from "express";
import AppDataSource from "../dataSource";
import { Recipe } from "../entity/recipe";
import { Ingredient } from "../entity/ingredients";
import { Product } from "../entity/products";


const recipeRouter = express.Router()

recipeRouter.use(express.json())

const appDataSource = AppDataSource

recipeRouter.get("/", async (req, res) => {

    try{

        const recipes = await appDataSource
                            .getRepository(Recipe).createQueryBuilder("recipes")
                            .leftJoinAndSelect("recipes.products", "product")
                            .leftJoinAndSelect("product.ingredients", "ingredient")
                            .getMany()
        res.json(recipes)

    } catch (error){
        console.log("an error has occured in recipeRoute")
        return res.status(500).json({message: error})
    }
});

recipeRouter.put("/:id/craft", async (req, res) => {
    try {
        let id = parseInt(req.params.id)
        let { amount, products} = req.body

        var recipeRequest = await appDataSource.getRepository(Recipe).findOneBy({id: id})

        if(!recipeRequest) {
            return res.status(500).json({message: "No Recipe Found  ¯\_(ツ)_/¯ "})
        } else {

            recipeRequest!.amountCrafted = amount //updates (aleardy incremented in frontend)

            // loop  through the ingredients and deduct the inventory amount
            await updateIngredientAmount(products);

            // save our recipe amount and return it
            var newRecipeData = await appDataSource.getRepository(Recipe).save(recipeRequest);
            return res.json(newRecipeData);
        }
    } catch (error) {
        console.log(" Something went wrong")
        return res.status(500).json({message: error})
    }
});

const updateIngredientAmount = async (Products: Product[]) => {
    try {

        for (var product of Products){

            var ingredientItem = await appDataSource.getRepository(Ingredient).findOneBy({id: product.inventoryId})

            if(!ingredientItem) {
                throw new Error(`Ingredient item with ID ${product.productId} not found`)
            }

            ingredientItem!.stock = product.ingredients!.stock - product.amount

            await appDataSource.getRepository(Ingredient).save(ingredientItem!)
        }
    } catch (error) {
        console.log("Something Went Wrong in updateInventoryAmount")
        throw error
    }
}

export default recipeRouter