// import express
const express = require('express');
const bodyParser = require('body-parser');

// use express method
const app = express();

// define route
const router = express.Router();

// define model collection
const bookModel = require('./bookSchema');
// const authorModel = require('./authorSchema');

// import mongoose
const mongoose = require('mongoose');

// connect mongoose to mongodb
// define database name 
const mongoDB = 'mongodb://127.0.0.1/zetta-camp';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, error => {
    // if something error, log the error
    if (error) {
        console.log("Error : " + error);
    } else {
        console.log("Connected to DB");
    }
});
module.exports = router;

// define schema
const Schema = mongoose.Schema;

// =============== CRUD book ===============

// save book to book collection
app.post('/book/save', function (req, res) {

    // get data from postman insert
    const {
        name,
        stock,
        date
    } = req.query

    // res.json({
    //     name: bookNameInput,
    //     stock: bookStockInput,
    //     date: bookDateAddedInput
    // })

    // save the res input to model
    const newBook = new bookModel({
        bookName: name,
        bookStock: stock,
        bookDateAdded: date
    });

    // save book to collection
    newBook.save(function (err, data) {
        if (err) {
            console.log(`Error insert book : ${err}`);
        } else {
            res.send("Data inserted");
        }
    });
});


// get all data from database
app.get('/book/get-all', function (req, res) {
    // using query find()
    bookModel.find(function (err, book) {
        if (err) {
            console.log(`Error get all data book : ${err}`);
        } else {
            res.send(book);
            console.log(`Book found`);
        }
    });
});

// find data by id
app.get('/book/get-id/:id', function (req, res) {
    const {
        id
    } = req.params;

    // find data by id
    bookModel.findById(id, function (err, book) {
        if (err) {
            console.log(`Error get book by id : ${err}`);
        } else {
            res.json(book);
            console.log(`Book Found`);
        }
    });
});

// edit data base on id
// change stock
app.put('/book/edit/:id', function (req, res) {
    // get id from url
    const {
        id
    } = req.params;

    // get stock from postman
    const {
        stock
    } = req.query;

    // find by id from url and update stock
    bookModel.findByIdAndUpdate(id, {
        bookStock: stock
    }, {
        new: true
    }, function (err, book) {
        if (err) {
            consol.log(`Error update : ${err}`);
            s
        } else {
            res.send(book);
            console.log(`Book ${book.id} updated`);
        }
    });
});


app.get('/book/get-async/:id', async function (req, res) {
    // get id from url
    const {
        id
    } = req.params;

    // get stock from postman
    const {
        stock
    } = req.query;

    // find by id from url and update stock
    try {
        const result = await bookModel.findById(id);
        res.send(result);
    } catch (err) {
        console.log(err);
    }

});

// delete data from database
app.delete('/book/delete/:idDelete', function (req, res) {
    const {
        idDelete
    } = req.params;

    // find data by id and delete data base on id
    bookModel.findByIdAndDelete(idDelete, function (err, book) {
        if (err) {
            console.log(err);
        } else {
            res.send(`Data with Id : ${book.id} deleted`);
        }
    });
});

// Parses the text as url encoded data
app.use(bodyParser.urlencoded({
    extended: true
}));

// Parses the text as json
app.use(bodyParser.json());

// declare port
const port = 8080;
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// to make url with port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});