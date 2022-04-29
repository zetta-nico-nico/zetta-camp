// import mongoose
const mongoose = require('mongoose');

// define books schema
const bookSchema = new mongoose.Schema({
    bookName: String,
    bookStock: Number,
    bookDateAdded: Date
}, {
    collection: 'books'
});

// export bookSchema
module.exports = mongoose.model('books', bookSchema);