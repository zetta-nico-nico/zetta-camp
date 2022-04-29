// import express
const express = require('express');

// import data loader
const DataLoader = require('dataloader');

const {
    applyMiddleware
} = require('graphql-middleware');

const {
    makeExecutableSchema
} = require('graphql-tools');

// use express
const app = express();

// import schema
// import book schema
const BookModel = require('./schema/bookSchema');

// import book shelf schema
const BookShelfModel = require('./schema/bookShelfSchema');

// import mongoose
const mongoose = require('mongoose');

// use Schema
const Schema = mongoose.Schema;

// connect to MongoDB
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
app.get('/', async function (req, res) {
    try {
        res.send(`Hello World`);
    } catch (err) {
        res.send(`Error express: ${err.message}`);
    }
});

// import apollo server express
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

// define graphql schema
const typeDefs = gql `
scalar Date

input BookInput{
    bookName: String
   bookStock: Int
   bookDateAdded: String
}

input BookShelfInput{
    book_shelf_name: String  
    book_id: ID  
    date_updated: String
}

input BookToBookShelfInput{
    book_shelf_id: ID
    book_id: ID
    date_updated: String
}

input BookUpdateInput{
    book_id: ID
    book_name: String
    book_stock: Int
    book_date_added: String
}

input BookShelfUpdateInput{
    book_shelf_id: ID
    book_shelf_name: String
}

input BookInBookShelfUpdateInput{
    book_shelf_id: ID
    book_id: ID
    book_date_added: String
}

input BookRemoveInBookShelfUpdateInput{
    book_shelf_id: ID
    book_id: ID
}

input BookChangeInBookShelfInput{
    book_shelf_id: ID
    book_id_before: ID
    book_id_after: ID
}

input BookDelete{
    book_id: ID
}

input BookShelfDelete{
    book_shelf_id: ID
}

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

type Mutation{
    addBooks(book_input: BookInput): Books
    addBookShelf(book_shelf_input: BookShelfInput): BookShelves
    addBookToBookShelf(book_input: BookToBookShelfInput): BookShelves
    updateBook(book_input: BookUpdateInput): Books
    updateBookShelf(book_shelf_input: BookShelfUpdateInput): BookShelves
    updateBookInBookShelf(book_shelf_input: BookInBookShelfUpdateInput): BookShelves
    updateChangeBookInBookShelf(book_shelf_input: BookChangeInBookShelfInput): BookShelves
    removeBookInBookShelfUpdateInput(book_shelf_input: BookRemoveInBookShelfUpdateInput): BookShelves
    deleteBook(book_delete_id: BookDelete): Books
    deleteBookShelf(book_shelf: BookShelfDelete) : BookShelves 
}
type Query{
    getAllBooks: [Books]
    getAllBookShelves: [BookShelves]
    getBookById(id: ID): Books
    getBookShelfById(id: ID): BookShelves
    getBookShelfLoader: BookShelves
}
`;

// define query 
// ==================== Books Mutation ====================
// insert book
const addBooks = async function (parent, {
    book_input
}) {
    // destruct book_input
    const {
        bookName,
        bookStock,
        bookDateAdded
    } = book_input;
    try {
        // convert date string from input to date
        const newDate = new Date(bookDateAdded);

        // save input result into new Model
        const newBook = new BookModel({
            bookName: bookName,
            bookStock: bookStock,
            bookDateAdded: newDate
        });

        // save model to database
        const result = await newBook.save();
        console.log(`Book Inserted`);
        // console.log(book_input);
        return result;
    } catch (err) {
        console.log(`Error insert book : ${err.message}`);
    };
};

// update book name and stock
const updateBook = async function (parent, {
    book_input
}) {
    try {
        // destruct book_input
        const {
            book_id,
            book_name,
            book_stock,
            book_date_added
        } = book_input;
        // console.log(book_id, book_name, book_stock, book_date_added);

        // convert date into new Date
        const newDate = new Date(book_date_added);

        // update book
        const result = await BookModel.findByIdAndUpdate(book_id, {
            bookName: book_name,
            bookStock: book_stock,
            bookDateAdded: newDate,
        }, {
            new: true
        });
        console.log(`Book Updated`);
        return result;

    } catch (er) {
        console.log(`Error updating book : ${er.message}`);
    };
};

// delete book with id
const deleteBook = async function (parent, {
    book_delete_id
}) {
    try {
        // destruct book_delete_id
        const {
            book_id
        } = book_delete_id;

        // console.log(book_id);
        const result = await BookModel.findByIdAndDelete(book_id);
        console.log(`Book Deleted`);
    } catch (err) {
        console.log(`Error deleting book : ${err.message}`);
    };
};

// ==================== Books Query ====================
// query get all books query
const getAllBooks = async function (parent) {
    try {
        const result = await BookModel.find();
        return result;
    } catch (err) {
        console.log(`Error getting books: ${err.message}`);
    };
};

// get book by id
const getBookById = async function (parent, {
    id
}) {
    try {
        const result = await BookModel.findOne({
            _id: id
        });
        // console.log(result);
        return result;
    } catch (err) {
        console.log(`Error getting book by id: ${err.message}`);
    };
};


// ==================== Books Shelf Mutation ====================
// add book shelf
const addBookShelf = async function (parent, {
    book_shelf_input
}) {
    try {
        // destruct book_shelf_input
        const {
            book_shelf_name,
            date_updated,
            book_id
        } = book_shelf_input;

        // change date string into new Date
        const newDate = new Date(date_updated);

        // save input result to new Model
        const newBookShelf = new BookShelfModel({
            book_shelf_name: book_shelf_name,
            book_list: {
                book_id: book_id,
                date_updated: newDate
            }
        });
        // save model into database
        // console.log(newBookShelf);
        const result = await newBookShelf.save();
        console.log(`Book Shelf Inserted`);
        return result;

        // console.log(book_shelf_input.book_shelf_name);
    } catch (err) {
        console.log(`Error adding bookshelf: ${err.message}`);
    };

};

// add book to existing shelf
const addBookToBookShelf = async function (parent, {
    book_input
}) {
    try {
        // destruct book_input
        const {
            book_shelf_id,
            book_id,
            date_updated
        } = book_input;

        // convert date into new Date
        const newDate = new Date(date_updated);
        const result = await BookShelfModel.updateOne({
            _id: book_shelf_id,
        }, {
            $addToSet: {
                book_list: {
                    book_id: book_id,
                    date_updated: newDate
                }
            }
        });
        console.log(`Book Shelf with ID:  ${book_shelf_id} updated`);
        return result;
    } catch (err) {
        console.log(`Error adding book to bookshelf: ${err.message}`);
    };
};

// update book shelf name
const updateBookShelf = async function (parent, {
    book_shelf_input
}) {
    try {
        // destruct book shelf
        const {
            book_shelf_id,
            book_shelf_name
        } = book_shelf_input;

        // console.log(book_shelf_id, book_shelf_name);
        const result = await BookShelfModel.findByIdAndUpdate(book_shelf_id, {
            book_shelf_name: book_shelf_name
        }, {
            new: true
        });
        console.log(`Book Shelf Updated`);
        return result;
    } catch (err) {
        console.log(`Error updating bookshelf: ${err.message}`);
    };
};

// update book in book shelf
const updateBookInBookShelf = async function (parent, {
    book_shelf_input
}) {
    try {
        // destruct book_shelf_input
        const {
            book_shelf_id,
            book_id,
            book_date_added
        } = book_shelf_input;
        // console.log(book_shelf_id, book_id, book_date_added);

        // change date into new Date
        const newDate = new Date(book_date_added);

        // search library by id
        // change date filter by book id
        const result = await BookShelfModel.updateOne({
            _id: book_shelf_id,
        }, {
            $set: {
                "book_list.$[element].date_updated": newDate
            }
        }, {
            arrayFilters: [{
                "element.book_id": book_id

            }]
        });
        console.log(`Book in Book Shelf updated`);
        return result;
    } catch (err) {
        console.log(`Error Update book in bookshelf : ${err.message}`);
    };
};

// change book into new book
const updateChangeBookInBookShelf = async function (parent, {
    book_shelf_input
}) {
    try {
        // destruct book_shelf_input
        const {
            book_shelf_id,
            book_id_before,
            book_id_after
        } = book_shelf_input;
        // console.log(book_shelf_id, book_id_before, book_id_after);

        // find book shelf first
        // pull the book in book shelf base on id
        // push the new book in book shelf
        const result = await BookShelfModel.updateOne({
            _id: book_shelf_id,
        }, {
            $set: {
                "book_list.$[element].book_id": book_id_after
            }
        }, {
            arrayFilters: [{
                "element.book_id": book_id_before

            }]
        });
        console.log(`Book in Book Shelf updated`);
        return result;
    } catch (err) {
        console.log(`Error update change bookshelf: ${err.message}`);
    };
};

// delete one book from bookshelf
const removeBookInBookShelfUpdateInput = async function (parent, {
    book_shelf_input
}) {
    try {
        // destruct book_shelf_input
        const {
            book_shelf_id,
            book_id
        } = book_shelf_input;

        // remove book base on id
        const result = await BookShelfModel.updateOne({
            _id: book_shelf_id
        }, {
            $pull: {
                book_list: {
                    book_id: book_id
                }
            }
        });
        console.log(`Book Removed frm book shelf`);
        return result;
    } catch (err) {
        console.log(`Error remove book from bookshelf: ${err.message}`);
    }
};

// delete book shelf with id
const deleteBookShelf = async function (parent, {
    book_shelf
}) {
    try {
        // destruct book_shelf
        const {
            book_shelf_id
        } = book_shelf;

        // delete book shelf
        // console.log(book_shelf_id);
        const result = await BookShelfModel.findByIdAndDelete(book_shelf_id);
        console.log(`Book Shelf deleted`);
        return result;
    } catch (err) {
        console.log(`Error deleting book shelf: ${err.message}`);
    };
};


// ==================== Books Shelf Query ====================
// define get all bookshelves query
const getAllBookShelves = async function (parent) {
    try {
        const result = await BookShelfModel.find().populate('book_list.book_id');
        return result;
    } catch (err) {
        console.log(`Error getting bookshelves: ${err.message}`);
    };
};

// get bookshelf by id
const getBookShelfById = async function (parent, {
    id
}) {
    try {
        const result = await BookShelfModel.findOne({
            _id: id
        }).populate('book_list.book_id');
        // console.log(result);
        return result;
    } catch (err) {
        console.log(`Error getting book by id: ${err.message}`);
    };
};


// ====================  Data Loader ====================
const bookget = async function (id) {
    const result = await BookShelfModel.findById(id);
};


// const bookloader = new DataLoader(keys => bookget(keys));
// const bookloader = new DataLoader((data) => {
//     return data;
// });
// const result = bookloader.load("625e5acebd2b14d42f86d4eb").then((data) => data);
const loader = new DataLoader(async (id) => {
    const result = await BookShelfModel.findById(id);
    const resultMap = {};
    // for(const res of result){
    //     console.log(res._id);
    // };
    // result.forEach((data) => {
    //     resultMap[result._id] = result;
    // });

    // return id.map(key => resultMap[key]);
});

// console.log(loader.load("625e5acebd2b14d42f86d4eb"));
// const loadertest = () => new DataLoader(async (id) => {
//     const result = await BookShelfModel.findById(id);
//     return result;
// })
// console.log(loadertest().load("625e5acebd2b14d42f86d4eb"));
// console.log(bookloader.load("625e5acebd2b14d42f86d"))
// console.log(result);

// authorization
const requireAuth = async (resolver, parent, args, ctx) => {
    let Authorization = ctx.req.get('Authorization');
    if (!Authorization) {
        throw new Error('Authorization header is missing');
    }
    let token = Authorization;

    if (!token) {
        throw new Error('UnAuthenticated');
    }
    ctx.token = token;
    // const user = getuserbytoken
    // ctx.userId = user._id;

    return resolver(); //call the next resolver
};

let authMiddleware = {
    Query: {
        getAllBooks: requireAuth,
        getAllBookShelves: requireAuth
    },
    Mutation: {
        deleteBook: requireAuth,
        deleteBookShelf: requireAuth
    }
};


// define resolvers
const resolvers = {
    Query: {
        getAllBooks,
        getAllBookShelves,
        getBookById,
        getBookShelfById
    },

    Mutation: {
        addBooks,
        addBookShelf,
        addBookToBookShelf,
        updateBook,
        updateBookShelf,
        updateBookInBookShelf,
        updateChangeBookInBookShelf,
        removeBookInBookShelfUpdateInput,
        deleteBook,
        deleteBookShelf
    }
};


const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

const server = new ApolloServer({
    schema: protectedSchema,
    typeDefs,
    resolvers,
    context: (req) => ({
        req: req.req
    })
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