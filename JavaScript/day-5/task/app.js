// import express
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse json object to string
const jsonParser = bodyParser.json();
// declare port 
const port = 8080;


// use jsonParse
app.use(jsonParser);

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

const urlencodedParser = bodyParser.urlencoded({
    extended: false
})

// route to get hello world
app.get('/', (req, res) => {
    res.send('Hello World!');
    res.json({
        name: req.query.name,
        stock: req.query.stock
    });
});


// try get with params
// post request on get route (/)
app.get('/get/:bookName/:bookStock', (req, res) => {
    // destruct the object
    const {
        bookName,
        bookStock
    } = req.params;

    // const book = {
    //     nameBook: bookName,
    //     stockBook: +bookStock,
    //     result: `There are ${book.nameBook} ${book.stockBook} books left in stock, you ${book.stockBook <= 3 ? "can't" : "can"}  get this book now`
    // };

    // res.json(book);
    // console.log(req.params);
    res.json({
        nameBook: bookName,
        // change stock into number
        stockBook: +bookStock,
        result: `There are ${bookName} ${bookStock} books left in stock, you ${+bookStock <= 3 ? "can't" : "can"}  get this book now`
    });

    // res.send(`Got a post request `);
});


// get book status using parameter in postman
app.get('/book', (req, res, next) => {

    // destruct the object
    const {
        bookName,
        bookStock
    } = req.query;
    res.json({
        name: bookName,
        // change stock into number
        stock: +bookStock,
        result: `There are ${bookName} ${bookStock} books left in stock, you ${+bookStock <= 3 ? "can't" : "can"}  get this book now`
    });
})


// to make url with port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});