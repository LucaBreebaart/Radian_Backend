import express from 'express';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import AppDataSource from './dataSource';
import inventoryRouter from './routes/inventoryRoute';
// import ormconfig from '../ormconfig.json';

const cors = require('cors');

const app = express();

app.use(cors())

dotenv.config()

const appDataSource = AppDataSource


app.get('/', (req, res) => {
    res.send('Hello, world!');
});


// app.get('/users', async (req, res) => {
//     const users = await appDataSource
//     .manager.find(Lecturer)


//     // console. log ( users )
//     res.send(users)
// });


// app.get('/users/:id', async (req, res) => {

//     var id = parseInt(req.params.id);

//     const user = await appDataSource.getRepository(Lecturer)
//     .findOneBy({id: id});

//     res.send(user)
// })

app.use('/inventory', inventoryRouter);

app.listen(process.env.PORT, () => {
    console.log('Server is listening on port 3000');
});

