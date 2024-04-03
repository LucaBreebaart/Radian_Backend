import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const password = process.env.DB_PASSWORD; // Retrieve password from environment variable

const AppDataSource = new DataSource(
    {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "postgres",
        "password": password,
        "database": "radian_db",
        "entities": ["src/entity/*.ts"],
        "logging": true,
        "synchronize": true
    }
)

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource;