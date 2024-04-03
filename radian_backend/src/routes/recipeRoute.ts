import  express from "express";
import AppDataSource from "../dataSource";
import { Recipe } from "../entity/recipe";
import { Ingredient } from "../entity/ingredients";
import { Product } from "../entity/products";
import { serializeWithBufferAndIndex } from "typeorm/driver/mongodb/bson.typings";


const recipeRouter = express.Router()

recipeRouter.use(express.json())

const appDataSource = AppDataSource

recipeRouter.get("/", async (req, res) => {

    try{

        const recipes = await appDataSource
                            .getRepository(Recipe)
                            .createQueryBuilder("recipes")
                            .leftJoinAndSelect("recipes.products", "product")
                            .leftJoinAndSelect("product.ingredients", "ingredient")
                            .getMany()
        res.json(recipes)

    } catch (error){
        console.log("an error has occured in recipeRoute while getting recipes")
        return res.status(500).json({message: error})
    }
});

recipeRouter.get("/:id", async (req, res) => {
    try {
        const id: number = parseInt(req.params.id, 10)

        const recipe = await appDataSource
        .getRepository(Recipe)
        .findOne({ where: {id}, relations: ["products"]});

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json(recipe);

    } catch (error) {
        
        console.log("An error has occured in recipeRoute while trying to get the specific Recipe", error)
        return res.status(500).json({message: error})
    }
});

recipeRouter.get("/:id/products", async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        const recipe = await appDataSource
            .getRepository(Recipe)
            .findOneOrFail({
                where: {id},
                relations: ["products"] 
            })

        if (!recipe || !recipe.products) {
            return res.status(404).json({ message: "Recipe products not found" })

        }

        const ingredients = recipe.products.map(product => product.ingredients);

        res.json(ingredients);
    } catch (error) {
        console.log("An error occurred while fetching ingredients by recipe ID", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

recipeRouter.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name, img, price, description, amountCrafted } = req.body

        var updateRecipeData = await appDataSource.getRepository(Recipe).findOneBy({ id: id })

        if (!updateRecipeData) {
            return res.status(500).json({message: "No Product Found"})
        }else {

            updateRecipeData.name = name
            updateRecipeData.img = img
            updateRecipeData.price = price
            updateRecipeData.description = description
            updateRecipeData.amountCrafted = amountCrafted

            var newRecipeData = await appDataSource.getRepository(Recipe).save(updateRecipeData)
            return res.json(newRecipeData)

        }

    } catch (error) {
        console.log("Something went wrong while updating")
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