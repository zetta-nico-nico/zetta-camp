// import express
const express = require('express');

// import mongoose
const mongoose = require('mongoose');

// use Router from express
const router = express.Router();

// define schema
const schema = mongoose.Schema;

// define database name
const mongoDB = 'mongodb://127.0.0.1/zetta-camp';

// connect to db
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


// use existing book in collection
const bookSchema = new schema({
    bookName: String,
    bookStock: Number,
    bookDateAdded: Date,
}, {
    // name the collection 
    collection: 'books'
});

// use book to make query
const Book = mongoose.model('book', bookSchema);


// to read all book
router.get('/get-all', async function (req, res) {

    try {
        // find all book using find method
        const result = await Book.find({});
        res.send(result);
    } catch (err) {
        console.log(`Error read all book : ${err.message}`);
    };

});

// to find book base on id
router.get('/get-book/:id', async function (req, res) {
    // destruct id from params
    const {
        id
    } = req.params;

    try {
        // find book base on id using findById method
        const result = await Book.findById(id);
        res.send(result);
    } catch (err) {
        console.log(`Error find book id : ${err.message}`);
    };
});


// insert book 
// insert book from query
router.post('/insert-book', async function (req, res) {
    // destruct query
    const {
        name,
        stock,
        date
    } = req.query;

    // save query to new variable
    const bookSave = new Book({
        bookName: name,
        bookStock: stock,
        bookDateAdded: date
    });

    try {
        // save data using save method
        const result = await bookSave.save();
        res.send(`Book Inserted`);
    } catch (err) {
        console.log(`Error insert book : ${err.message}`);
    };
});


// update data
router.put('/update-book/:id', async function (req, res) {
    // destruct params
    const {
        id
    } = req.params;

    // destruct query
    const {
        stock
    } = req.query;

    // store the stock into new variable
    const stockUpdate = {
        bookStock: stock
    };

    // update data using findByIdAndUpdate method
    try {
        const result = await Book.findByIdAndUpdate(id, stockUpdate, {
            new: true
        });
        res.send(`Data Updated`);
    } catch (err) {
        console.log(`Error update book : ${err.message}`);
    };

});

router.delete('/delete-book/:id', async function (req, res) {

    // destruct id
    const {
        id
    } = req.params;

    // delete data using findByIdAndDelete method
    try {
        const result = await Book.findByIdAndDelete(id);
        res.send(`Data Deleted`);
    } catch (err) {
        console.log(`Error delete book: ${err.message}`);
    };
});