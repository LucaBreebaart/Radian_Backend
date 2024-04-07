import Express from "express";
import AppDataSource from "../dataSource";
import { Ingredient } from "../entity/ingredients";
import { MoreThan } from "typeorm";
import { Request, Response } from "express";

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


ingredientsRouter.get("/:location", async (req, res) => {
    try {
        const location = req.params.location; // Get the location parameter from the URL

        // Validate if the location is one of the supported locations
        if (!["durban", "pretoria", "capeTown"].includes(location)) {
            return res.status(400).json({ error: "Invalid location" });
        }

        // Find ingredients where the stock in the specified location is greater than 0
        const ingredients = await appDataSource.getRepository(Ingredient).find({ where: { [location]: MoreThan(0) } });

        res.json(ingredients);
    } catch (error) {
        console.error("Error fetching ingredients", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

ingredientsRouter.get("/byId/:id", async (req, res) => {
    try {
        const id: number = parseInt(req.params.id, 10);

        const ingredient = await appDataSource
            .getRepository(Ingredient)
            .findOne({ where: { id } });

        if (!ingredient) {
            return res.status(404).json({ message: "Ingredient not found" });
        }

        console.log("Selected Ingredient by ID:", ingredient); // Log the selected ingredient

        res.json(ingredient);
    } catch (error) {
        console.error("Error fetching ingredient by ID", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


////////////////////////////////////////////////////////////////

ingredientsRouter.put("/byId/:id", async (req, res) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const ingredientToUpdate = await appDataSource
            .getRepository(Ingredient)
            .findOne({ where: { id } });

        if (!ingredientToUpdate) {
            return res.status(404).json({ message: "Ingredient not found" });
        }

        // Update the ingredient properties
        Object.assign(ingredientToUpdate, req.body);

        // Save the updated ingredient
        const updatedIngredient = await appDataSource
            .getRepository(Ingredient)
            .save(ingredientToUpdate);

        res.json(updatedIngredient);
    } catch (error) {
        console.error("Error updating ingredient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


////////////////////////////////////////////////////////////////


ingredientsRouter.post("/", async (req, res) => {
    try {
        const { name, category, icon, description, stock, sku, currentLocation } = req.body;

        // Create a new instance of the ingredients entity with the provided data
        const newIngredientItem = appDataSource.getRepository(Ingredient).create({
            name,
            category,
            icon,
            description,
            [currentLocation]: stock, // Set the stock for the current location
            sku // Include sku field in the creation
        });

        // Save the new ingredients item to the database
        const savedItem = await appDataSource.getRepository(Ingredient).save(newIngredientItem);

        res.status(201).json(savedItem); // 201 status code for successful creation
    } catch (error) {
        console.error("Error creating ingredients item", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




export default ingredientsRouter