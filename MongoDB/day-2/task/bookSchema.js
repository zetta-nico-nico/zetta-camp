// import mongoose
const mongoose = require('mongoose');

// define schema
const Schema = mongoose.Schema;

// make new schema
const bookSchema = new Schema({
    bookName: String,
    bookStock: Number,
    bookDateAdded: Date,
}, {
    versionKey: false
});


// insert bookSchema into collection
module.exports = mongoose.model('book', bookSchema);