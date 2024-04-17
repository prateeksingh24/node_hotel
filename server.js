const express = require("express");
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;


const Person = require('./models/Person');

app.get('/', (req, res) => {
    res.send("Welcome to my hotel ...")
})


//Import the router files
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');


//Use the routers
app.use('/person',personRoutes);
app.use('/menu',menuRoutes);

app.listen(PORT, () => {
    console.log('Sever is running oon port 3000')
})

