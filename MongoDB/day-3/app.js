// import express 
const express = require('express');

// import body-parser
const bodyParser = require('body-parser');

// use express
const app = express();

// define port used in server
const port = 8080;

// define route
const books = require('./routes/book');
const libraries = require('./routes/library');


// use route 
app.use('/book', books);
app.use('/library', libraries);

// simple return if connect API or not
app.get('/', function (req, res) {
    res.send(`Hello World`);
})


// listen port to run app
app.listen(port, function () {
    console.log(`App running at port ${port}`);
})