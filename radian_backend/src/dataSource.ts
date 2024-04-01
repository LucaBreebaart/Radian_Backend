import { DataSource } from "typeorm";

const AppDataSource = new DataSource(
    {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "postgres",
        "password": "123456",
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