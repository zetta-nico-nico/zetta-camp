// import express
const express = require('express');

// use express 
const app = express();

// import mongoose 
const mongoose = require('mongoose');

// import body-parser
const bodyParser = require('body-parser');

// define port 
const port = 8080;


// use bookShelf collection
const bookShelf = require('./model/bookShelfSchema');

// use route bookShelf
const bookShelfRoute = require('./route/bookShelf');

// use bookShelf route
app.use('/book-shelf', bookShelfRoute);


// test if the express is running or not
app.get('/', async function (req, res) {
    try {
        res.send(`Hello World`);
    } catch (err) {
        console.log(`Error Hello World : ${err.message}`);
    }
});

// use the port
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});