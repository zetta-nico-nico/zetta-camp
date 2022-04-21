// import mongoose
const mongoose = require('mongoose');

// define schema
const Schema = mongoose.Schema;

// make new schema
// const authorSchema = new Schema({
//     name: String,
//     dateOfBirth: Date,
//     bookList: []
// });

const authorSchema = new Schema({
    name: {
        type: String,
    },
    dateOfBirth: {
        type: Date
    },
    bookList: [{
        type: Schema.Types.ObjectId,
        ref: 'books'
    }]
});

// insert bookSchema into collection
module.exports = mongoose.model('author', authorSchema);