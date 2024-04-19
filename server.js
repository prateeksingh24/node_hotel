const express = require("express");
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();
const passport = require('./auth');

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//Middleware Function

const logRequest = (req,res,next)=>{
    console.log(`${new Date().toLocaleString()} Request Mode to : ${req.originalUrl}`);
    next();
}


app.use(passport.initialize());



app.use(logRequest);
const locaAuthMiddleware = passport.authenticate('local',{session :false});
app.get('/',function(req, res) {
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

