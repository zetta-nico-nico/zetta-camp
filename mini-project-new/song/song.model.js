// import mongoose
const mongoose = require('mongoose');

// define Schema
const Schema = mongoose.Schema;

// make song list schema
const songListSchema = new Schema({
    name: String,
    genre: String,
    duration: Number,
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = mongoose.model('songlists', songListSchema);