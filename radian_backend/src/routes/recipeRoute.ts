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
            return res.status(500).json({message: "No Recipe Found  "})
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

//////////////////////////////////////////////////////////////////////////////////
// recipeRouter.put("/:id/craft", async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { amount, products } = req.body;

//         // Check if required fields are present
//         if (!amount || !products || !Array.isArray(products)) {
//             return res.status(400).json({ message: "Invalid request data" });
//         }

//         const recipeRequest = await appDataSource.getRepository(Recipe).findOne({ where: {id}});

//         if (!recipeRequest) {
//             return res.status(404).json({ message: "Recipe not found" });
//         }

//         recipeRequest.amountCrafted += amount; // Increment the amountCrafted

//         // Update ingredient amounts
//         // await updateIngredientAmount(products, currentLocationValue);

//         // Save the updated recipe and return it
//         const updatedRecipe = await appDataSource.getRepository(Recipe).save(recipeRequest);
//         return res.json(updatedRecipe);
//     } catch (error) {
//         console.log("Error while updating recipe and ingredients:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });

// const updateIngredientAmount = async (products: Product[], currentLocation: keyof Ingredient) => {
//     try {
//         for (const product of products) {
//             const ingredientItem = await appDataSource.getRepository(Ingredient).findOne({ where: { id: product.inventoryId } });

//             if (!ingredientItem) {
//                 throw new Error(`Ingredient item with ID ${product.productId} not found`);
//             }

//             // Determine the current stock based on the current location
//             let currentLocationStock = 0;
//             switch (currentLocation) {
//                 case 'durban':
//                     currentLocationStock = ingredientItem.durban;
//                     break;
//                 case 'pretoria':
//                     currentLocationStock = ingredientItem.pretoria;
//                     break;
//                 case 'capeTown':
//                     currentLocationStock = ingredientItem.capeTown;
//                     break;
//                 default:
//                     throw new Error('Invalid current location');
//             }

//             // Update the stock based on the current stock and the amount
//             switch (currentLocation) {
//                 case 'durban':
//                     ingredientItem.durban = currentLocationStock - product.amount;
//                     break;
//                 case 'pretoria':
//                     ingredientItem.pretoria = currentLocationStock - product.amount;
//                     break;
//                 case 'capeTown':
//                     ingredientItem.capeTown = currentLocationStock - product.amount;
//                     break;
//                 default:
//                     throw new Error('Invalid current location');
//             }

//             await appDataSource.getRepository(Ingredient).save(ingredientItem);
//         }
//     } catch (error) {
//         console.log("Something Went Wrong in updateInventoryAmount", error);
//         throw error;
//     }
// };
export default recipeRouter