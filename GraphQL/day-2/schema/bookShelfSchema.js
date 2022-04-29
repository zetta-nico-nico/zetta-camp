// import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define bookshelf schema
const bookShelfSchema = new mongoose.Schema({
    book_shelf_name: String,
    book_list: [{
        book_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'books'
        },
        date_updated: Date
    }]
}, {
    collection: 'bookshelves'
});

module.exports = mongoose.model('bookshelves', bookShelfSchema);