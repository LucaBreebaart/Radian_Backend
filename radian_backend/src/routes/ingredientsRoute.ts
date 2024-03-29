import Express from "express";
import AppDataSource from "../dataSource";
import { Ingredient } from "../entity/ingredients";

const ingredientsRouter = Express.Router()

ingredientsRouter.use(Express.json())

const appDataSource = AppDataSource

ingredientsRouter.get("/", async (req, res) => {
    try {
        // console.log("called")
        const ingredients = await appDataSource
            .getRepository(Ingredient)
            .find()

        res.json(ingredients)
    }
    catch (error) {
        console.error("Error fetching ingredients  items", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

ingredientsRouter.put("/:id", async (req, res) => {
    try {

        const id = parseInt(req.params.id)

        const { name, description, category, icon, amount } = req.body

        const ingredientsItem = await appDataSource.getRepository(Ingredient)
            .findOneBy({ id: id })

        if (!ingredientsItem) {
            res.status(404).json({ message: "No item found" })
        }
        else {

            ingredientsItem!.stock = amount

            const updatedItem = await appDataSource.getRepository(Ingredient)
                .save(ingredientsItem!)
            res.json(updatedItem)

        }

    }
    catch (error) {
        console.error("Error updating ingredients  items", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


ingredientsRouter.post("/", async (req, res) => {
    try {
        const { name, description, category, icon, amount } = req.body;

        // Create a new instance of the ingredients entity with the provided data
        const newingredientsItem = appDataSource.getRepository(Ingredient).create({
            name,
            description,
            category,
            icon,
        });

        // Save the new ingredients item to the database
        const savedItem = await appDataSource.getRepository(Ingredient).save(newingredientsItem);

        res.status(201).json(savedItem); // 201 status code for successful creation
    } catch (error) {
        console.error("Error creating ingredients item", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default ingredientsRouter