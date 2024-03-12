import Express from "express";
import AppDataSource from "../dataSource";
import { Inventory } from "../entity/inventory";

const inventoryRouter = Express.Router()

inventoryRouter.use(Express.json())

const appDataSource = AppDataSource

inventoryRouter.get("/", async (req, res) => {
    try {
        // console.log("called")
        const inventory = await appDataSource
            .getRepository(Inventory)
            .find()

        res.json(inventory)
    }
    catch (error) {
        console.error("Error fetching inventory  items", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

inventoryRouter.put("/:id", async (req, res) => {
    try {

        const id = parseInt(req.params.id)

        const { name, description, category, icon, amount } = req.body

        const inventoryItem = await appDataSource.getRepository(Inventory)
            .findOneBy({ id: id })

        if (!inventoryItem) {
            res.status(404).json({ message: "No item found" })
        }
        else {

            inventoryItem!.amount = amount

            const updatedItem = await appDataSource.getRepository(Inventory)
                .save(inventoryItem!)
            res.json(updatedItem)

        }

    }
    catch (error) {
        console.error("Error updating inventory  items", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


inventoryRouter.post("/", async (req, res) => {
    try {
        const { name, description, category, icon, amount } = req.body;

        // Create a new instance of the Inventory entity with the provided data
        const newInventoryItem = appDataSource.getRepository(Inventory).create({
            name,
            description,
            category,
            icon,
            amount
        });

        // Save the new inventory item to the database
        const savedItem = await appDataSource.getRepository(Inventory).save(newInventoryItem);

        res.status(201).json(savedItem); // 201 status code for successful creation
    } catch (error) {
        console.error("Error creating inventory item", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default inventoryRouter