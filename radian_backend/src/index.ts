import express from 'express';
import dotenv from 'dotenv/config';
import { DataSource } from 'typeorm';
import AppDataSource from './dataSource';
import inventoryRouter from './routes/inventoryRoute';
import { Ingredient } from './entity/ingredients';
import recipeRouter from './routes/recipeRoute';
// import ormconfig from '../ormconfig.json';

require('dotenv').config()
// console.log(process.env)

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


// app.get('/users/:id', async (req, res) => {

//     var id = parseInt(req.params.id);

//     const user = await appDataSource.getRepository(Lecturer)
//     .findOneBy({id: id});

//     res.send(user)
// })

app.use('/inventory', inventoryRouter);

app.use('/recipes', recipeRouter);

app.listen(process.env.PORT, () => {
    console.log('Server is listening on port 3000');
});

