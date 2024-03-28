import express from 'express';
import dotenv from 'dotenv/config';
import { DataSource } from 'typeorm';
import AppDataSource from './dataSource';
import inventoryRouter from './routes/ingredientsRoute';
import { Ingredient } from './entity/ingredients';

import ingredientsRouter from './routes/ingredientsRoute';
import usereRouter from './routes/userRoute';

require('dotenv').config()

const cors = require('cors');
const app = express();
app.use(cors())

const appDataSource = AppDataSource

app.get('/ingredients', async (req, res) => {
    const ingredients = await appDataSource
        .manager.find(Ingredient)


    // console. log ( users )
    res.send(ingredients)
});

app.use('/ingrediemts', ingredientsRouter);

app.use('/users', usereRouter);


app.listen(process.env.PORT, () => {
    console.log('Server is listening on port 3000');
});

