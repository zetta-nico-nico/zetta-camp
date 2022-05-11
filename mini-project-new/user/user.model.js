// import mongoose 
const mongoose = require('mongoose');

// define Schema
const Schema = mongoose.Schema;

// define user Schema
const userSchemas = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    hashed_password: String,
    user_type: {
        type: String,
        enum: ['Administrator', 'Creator', 'Enjoyer'],
        default: 'Enjoyer'
    }
}, {
    versionKey: false
});


module.exports = mongoose.model('users', userSchemas);