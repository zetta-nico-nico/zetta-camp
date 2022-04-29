// import express
const express = require('express');

// use express
const app = express();

// import mongoose
const mongoose = require('mongoose');

// use Schema
const Schema = mongoose.Schema;

// import book and bookshelves
const Books = require('./schema/bookSchema');
const BookShelves = require('./schema/bookShelfSchema');

// import appolo server
const {
    ApolloServer,
    gql
} = require('apollo-server-express');
const {
    find,
    findOne
} = require('./schema/bookSchema');

// define graphql schema
const typeDefs = gql `
scalar Date
type Books{
   id:ID
   bookName: String,
   bookStock: Int,
   bookDateAdded: Date
}

type BookShelves{
    id: ID
    book_shelf_name: String
    book_list: [book_list]
}

type book_list{
    book_id: Books
    date_updated: Date
    _id: ID
}

type Query{
    getAllBooks: [Books]
    getAllBookShelves: [BookShelves]
    getBookById(id: ID): Books
    getBookShelfById(id: ID): BookShelves
    
}
`;


// define port
const port = 8080;

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


// check if express is running or not
// app.get('/', async (req, res) => {
//     try {
//         res.send(`Hello World`);
//     } catch (err) {
//         res.send(`Error express: ${err.message}`);
//     }
// });


// define query 
// query get all books query
const getAllBooks = async function (parent) {
    try {
        const result = await Books.find();
        return result;
    } catch (err) {
        console.log(`Error getting books: ${err.message}`);
    }


};

// define get all bookshelves query
const getAllBookShelves = async function (parent) {
    try {

        const result = await BookShelves.find().populate('book_list.book_id');
        console.log(typeof result);
        return result;
    } catch (err) {
        console.log(`Error getting bookshelves: ${err.message}`);
    }
};

// get book by id
const getBookById = async function (parent, {
    id
}) {
    try {
        const result = await Books.findOne({
            _id: id
        });
        // console.log(result);
        return result;
    } catch (err) {
        console.log(`Error getting book by id: ${err.message}`);
    };
};

// get bookshelf by id
const getBookShelfById = async function (parent, {
    id
}) {
    try {
        const result = await BookShelves.findOne({
            _id: id
        }).populate('book_list.book_id');
        // console.log(result);
        return result;
    } catch (err) {
        console.log(`Error getting book by id: ${err.message}`);
    };
};

// define resolvers
const resolvers = {
    Query: {
        getAllBooks,
        getAllBookShelves,
        getBookById,
        getBookShelfById
    }
};

// define server 
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// run apollo server
server.start().then(res => {
    server.applyMiddleware({
        app
    });
    // run port 
    app.listen(port, () => {
        console.log(`App running in port ${port}`);
    });
});