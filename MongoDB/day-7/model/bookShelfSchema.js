// import express
const express = require('express');

// import mongoose 
const mongoose = require('mongoose');

// make schema 
const Schema = mongoose.Schema;

// define database name
const mongoDB = 'mongodb://127.0.0.1/zetta-camp';

// connect to database
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log(`Error connect mongodb ${err.message}`);
    } else {
        console.log(`Connected to database`);
    }
});


// make new bookShelf schema 
const bookShelfSchema = new Schema({
    book_shelf_name: String,
    book_list: [{
        book_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        date_updated: Date
    }]
});

module.exports = mongoose.model('bookshelves', bookShelfSchema);