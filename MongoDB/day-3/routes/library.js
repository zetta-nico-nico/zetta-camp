// import express
const express = require('express');

// import mongoose
const mongoose = require('mongoose');

// user Router from express
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


// create new schema library
const librarySchema = new schema({
    bookShelf: String,
    listBook: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});


const Library = mongoose.model('library', librarySchema);


// get all library
router.get('/get-library', async function (req, res) {

    // get all library list using find
    try {
        const result = await Library.find();
        res.send(result);
    } catch (err) {
        console.log(`Error get all library : ${err.message}`);
    };
});

// get library base on id
router.get('/get-library/:id', async function (req, res) {

    // destruct params
    const {
        id
    } = req.params;

    // get library base on id
    try {
        const result = await Library.findById(id);
        res.send(result);
    } catch (err) {
        console.log(`Error get library id ${err.message}`);
    }
});


// get book detail base on book id and
router.get('/get-library-book', async function (req, res) {

    // aggregate library and books 
    Library.aggregate([{
        $lookup: {
            from: 'books',
            localField: 'listBook',
            foreignField: '_id',
            as: 'Book List'
        }
    }]).exec(function (err, data) {
        if (err) {
            console.log(`Error : ${err.message}`);
        } else {
            res.send(data);
        }
    });
});


// find books base on id book in library
router.get('/find-book-library/:id', async function (req, res) {
    // destruct id
    const {
        id
    } = req.params;


    try {
        const result = await Library.find({
            listBook: {
                $in: id
            }
        });
        res.send(result);
    } catch (err) {
        console.log(`Error find book id : ${err.message}`);
    }
})

// insert data into library
router.post('/insert-library', async function (req, res) {

    // destruct query
    const {
        name,
        list
    } = req.query;

    // save query result in variable
    const librarySave = new Library({
        bookShelf: name,
        listBook: list
    });

    try {
        // save data 
        const result = await librarySave.save();
        // find data from name
        res.send(`Data Inserted`);
    } catch (err) {
        console.log(`Error insert library : ${err.message}`);
    };

});


// add new book to library
router.post('/add-book-library/:id', async function (req, res) {
    // destruct query
    const {
        list
    } = req.query;

    // destruct params
    const {
        id
    } = req.params;

    try {
        const result = await Library.updateOne({
            _id: id
        }, {
            $addToSet: {
                listBook: list
            }
        });
        res.send(`Library Book Updated`);
    } catch (err) {
        console.log(`Error adding book library : ${err.message}`);
    };
});

// update name library
router.put('/update-library', async function (req, res) {
    // destruct query
    const {
        id,
        name
    } = req.query;

    // store name in variable
    const nameLibrary = {
        bookShelf: name
    };

    try {
        const result = await Library.findByIdAndUpdate(id, nameLibrary, {
            new: true
        });
        res.send(`Data Updated`);
    } catch (err) {
        console.log(`Error updating library ${err.message}`);
    };
});


// update book 
router.put('/update-book-library', async function (req, res) {

    // destruct id
    const {
        idBook,
        idLibrary,
        book
    } = req.query;


    // save new book to variable
    const newBook = {
        listBook: book
    };
    // update book using updateOne
    try {
        // pull the value to update
        const resultPull = await Library.updateOne({
            _id: idLibrary
        }, {
            $pullAll: {
                listBook: [idBook]

            }
        });

        // add new book to array
        const resultPush = await Library.updateOne({
            _id: idLibrary
        }, {
            $addToSet: {
                listBook: book
            }
        });
        res.send(`Book Library Updated`);
    } catch (err) {
        console.log(`Error update book library ${err.message}`);
    }
});

// delete book from array
router.delete('/delete-book-library', async function (req, res) {
    // destruct query
    const {
        idBook,
        idLibrary
    } = req.query;

    // using updateOne 
    try {
        const result = await Library.updateOne({
            _id: idLibrary
        }, {
            $pullAll: {
                listBook: [idBook]
            }
        });

        res.send(`Data book librart deleted`);
    } catch (err) {
        console.log(`Error deleting book library : ${err.message}`);
    };
});

// delete library
router.delete('/delete-library/:id', async function (req, res) {
    // destruct id
    const {
        id
    } = req.params;

    // delete library using findByIdAndDelete
    try {
        const result = await Library.findByIdAndDelete(id);
        res.send(`Data library deleted`);
    } catch (err) {
        console.log(`Error deleting library : ${err.message}`);
    }
});