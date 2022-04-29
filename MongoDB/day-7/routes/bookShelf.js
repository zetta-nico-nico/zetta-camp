// import express
const express = require('express');

// import mongoose 
const mongoose = require('mongoose');

// import express Router
const router = express.Router();

// import bookShelf from model
const BookShelf = require('../model/bookShelfSchema');

module.exports = router;

// make pagination
// using facet and group
router.get('/pagination-book-name/:page', async (req, res) => {
    // lookup to get book data
    // group data by book name and count the total stock by each book
    // use facet to get each page contain 1 book with book name and book stock

    // destruct params
    const {
        page
    } = req.params;

    let limit = 2;

    try {
        const result = await BookShelf.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: 'book_list.book_id',
                    foreignField: '_id',
                    as: 'book_details'
                }
            },
            {
                $unwind: '$book_details'
            },
            {
                $addFields: {
                    book_name: '$book_details.bookName',
                    book_stock: '$book_details.bookStock'
                }
            },
            {
                $group: {
                    _id: '$book_name',
                    total_stock: {
                        $sum: '$book_stock'
                    }
                },
            },
            {
                $sort: {
                    _id: 1
                }
            }, {
                $facet: {
                    "Page": [{
                            $project: {
                                book_name: 1,
                                total_stock: 1
                            }
                        },
                        {
                            $skip: (+page * limit)
                        },
                        {
                            $limit: limit
                        }
                    ]
                }
            }
            // , {
            //     $facet: {
            //         "Page 1": [{
            //             $project: {
            //                 book_name: 1,
            //                 total_stock: 1
            //             }
            //         }, {
            //             $limit: 1
            //         }],
            //         "Page 2": [{
            //                 $project: {
            //                     book_name: 1,
            //                     total_stock: 1
            //                 }
            //             },
            //             {
            //                 $skip: 1
            //             }, {
            //                 $limit: 1
            //             }
            //         ],
            //         "Page 3": [{
            //                 $project: {
            //                     book_name: 1,
            //                     total_stock: 1
            //                 }
            //             },
            //             {
            //                 $skip: 2
            //             }, {
            //                 $limit: 1
            //             }
            //         ],
            //         "Page 4": [{
            //                 $project: {
            //                     book_name: 1,
            //                     total_stock: 1
            //                 }
            //             },
            //             {
            //                 $skip: 3
            //             }, {
            //                 $limit: 1
            //             }
            //         ],
            //         "Page 5": [{
            //                 $project: {
            //                     book_name: 1,
            //                     total_stock: 1
            //                 }
            //             },
            //             {
            //                 $skip: 4
            //             }, {
            //                 $limit: 1
            //             }
            //         ]
            //     },
            // }
        ]);
        res.send(result);
    } catch (err) {
        res.send(`Error pagination book name: ${err.message}`);
    }
});

// make pagination 2
// using facet and group
router.get('/pagination-book-name-two', async (req, res) => {
    // lookup to get book data
    // group data by book name and count the total stock by each book
    // use facet to get each page contain 2 book with book name and book stock
    try {
        const result = await BookShelf.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: 'book_list.book_id',
                    foreignField: '_id',
                    as: 'book_details'
                }
            },
            {
                $unwind: '$book_details'
            },
            {
                $addFields: {
                    book_name: '$book_details.bookName',
                    book_stock: '$book_details.bookStock'
                }
            },
            {
                $group: {
                    _id: '$book_name',
                    total_stock: {
                        $sum: '$book_stock'
                    }
                }
            }, {
                $facet: {
                    "Page 1": [{
                        $project: {
                            book_name: 1,
                            total_stock: 1
                        }
                    }, {
                        $limit: 2
                    }],
                    "Page 2": [{
                            $project: {
                                book_name: 1,
                                total_stock: 1
                            }
                        },
                        {
                            $skip: 2
                        }, {
                            $limit: 2
                        }
                    ],
                    "Page 3": [{
                            $project: {
                                book_name: 1,
                                total_stock: 1
                            }
                        },
                        {
                            $skip: 4
                        }, {
                            $limit: 2
                        }
                    ]
                },
            }
        ]);
        res.send(result);
    } catch (err) {
        res.send(`Error pagination book name: ${err.message}`);
    }
});




// filter using match query
// search book in library
router.get('/match-id/:id', async (req, res) => {

    // destruct params
    const {
        id
    } = req.params;
    try {
        // lookup to get all data first
        // search book from book details with book id
        // project result with book shelf, book name, and book stock
        const result = await BookShelf.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: 'book_list.book_id',
                    foreignField: '_id',
                    as: 'book_details'
                }

            },
            {
                $match: {
                    'book_details._id': mongoose.Types.ObjectId(id)
                }
            },
            {
                $project: {
                    book_shelf_name: 1,
                    'book_details.bookName': 1,
                    'book_details.bookStock': 1
                }
            }
        ]);
        res.send(result);
    } catch (err) {
        res.send(`Error match id: ${err.message}`);
    }
});

// use sorting query
router.get('/sort-book-total', async (req, res) => {
    try {
        // lookup to get all data
        // make new field book total contains total book stock in each book list
        // sort on most book stock
        const result = await BookShelf.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: 'book_list.book_id',
                    foreignField: '_id',
                    as: 'book_details'
                }
            },
            {
                $addFields: {
                    book_total: {
                        $sum: '$book_details.bookStock'
                    }
                }
            },
            {
                $project: {
                    book_shelf_name: 1,
                    book_total: 1
                }
            },
            {
                $sort: {
                    book_total: -1
                }
            }

        ]);
        res.send(result);
    } catch (err) {
        res.send(`Error sort book: ${err.message}`);
    }
});

// combine field with concat query
router.get('/concat-book', async (req, res) => {
    try {
        // use lookup first to get all data
        // unwind the array of object first to get string from array
        // make new field book name and book stock from array book details
        // then combine book name with stock
        // make new field to store that
        const result = await BookShelf.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: 'book_list.book_id',
                    foreignField: '_id',
                    as: 'book_details'
                }
            },
            {
                $unwind: '$book_details'
            },
            {
                $addFields: {
                    book_name: '$book_details.bookName',
                    book_stock_string: {
                        $toString: '$book_details.bookStock'
                    }
                }

            }, {
                $project: {
                    book_shelf_name: 1,
                    book_name: 1,
                    book_available: {
                        $concat: [
                            "Book Name = ", "$book_name", " with stock available : ", "$book_stock_string"
                        ]
                    }
                    // 'book_details.bookName': 1
                }
            }
        ]);
        res.send(result);
    } catch (err) {
        res.send(`Error concat book: ${err.message}`);
    }
});

// lookup query to join book collection
router.get('/look-up-book-shelf', async (req, res) => {

    try {
        // use lookup to get book data details from books collection
        const result = await BookShelf.aggregate([{
            $lookup: {
                from: 'books',
                localField: 'book_list.book_id',
                foreignField: '_id',
                as: 'book_details'
            }
        }]);
        res.send(result);
    } catch (err) {
        res.send(`Error lookup book: ${err.message}`);
    }
});


// display book details in bookshelf
router.get('/get-book-detail', async (req, res) => {

    try {
        const result = await BookShelf.aggregate([{
            $lookup: {
                from: 'books',
                localField: 'book_list.book_id',
                foreignField: '_id',
                as: 'book_details'
            }
        }]);
        res.send(result);
    } catch (err) {
        res.send(`Error get book details: ${err.message}`);
    }
});

// projection aggregation query
router.get('/projection-aggregate', async (req, res) => {

    // const {
    //     id
    // } = req.query;
    try {

        // lookup bookshelf to get book
        // project book name and book stock
        const result = await BookShelf.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: 'book_list.book_id',
                    foreignField: '_id',
                    as: 'book_details'
                }
            },
            {
                $project: {
                    'book_details.bookName': 1,
                    'book_details.bookStock': 1
                }
            }
        ]);

        res.send(result);
    } catch (err) {
        res.send(`Error projection aggregate : ${err.message}`);
    }

});

// unwind aggregation query
// to output all data each element
router.get('/unwind-aggregation', async (req, res) => {
    // for each book list 
    try {
        const result = await BookShelf.aggregate([{
            $unwind: "$book_list"
        }]);
        res.send(result);
    } catch (err) {
        res.send(`Error unwind aggregation : ${err.message}`);
    }
});

// addFields aggregate query
// to add book total
router.get('/add-fields-aggregation', async (req, res) => {
    try {
        const result = await BookShelf.aggregate([{
            $addFields: {
                book_total: {
                    $size: '$book_list'
                }
            }
        }]);
        res.send(result);
    } catch (err) {
        res.send(`Error add fields aggregation : ${err.message}`);
    }
});

// try connection if the route is working or not
router.get('/', async (req, res) => {
    try {
        res.send(`Hello World`);
    } catch (err) {
        console.log(`Error hello world bookShelf ${err.message}`);
    }
});

// get all data bookshelf with distinct bookshelf name
router.get('/get-book-shelf', async (req, res) => {

    try {
        // get all data
        const result = await BookShelf.find();
        // const result = await BookShelf.find().distinct('book_shelf_name');
        res.send(result);
    } catch (err) {
        res.send(`Error get all data : ${err.message}`);
    }

});

// filter data with elemMatch
// get book with certain id using elemMatch in
router.get('/get-book-match-in/:id', async (req, res) => {
    try {
        // destruct params
        const {
            id
        } = req.params;
        const result = await BookShelf.find({
            book_list: {
                $elemMatch: {
                    book_id: id
                }
            }
        });
        res.send(result);
    } catch (err) {
        res.send(`Error get book match: ${err.message}`);
    }
});

// get book with certain id using elemMatch ne
router.get('/get-book-match-ne/:id', async (req, res) => {
    try {
        // destruct params
        const {
            id
        } = req.params;
        const result = await BookShelf.find({
            'book_list': {
                $elemMatch: {
                    book_id: {
                        "$ne": id
                    }
                }
            }
        });
        res.send(result);
    } catch (err) {
        res.send(`Error get book match: ${err.message}`);
    }
});

// update data with arrayFilter
// update book wit arrayFilter
router.put('/update-book-filter', async (req, res) => {
    try {

        // destruct query
        const {
            idLibrary,
            idBook,
            date
        } = req.query;

        // update data
        const result = await BookShelf.updateOne({
            _id: idLibrary
        }, {
            $set: {
                "book_list.$[element].date_updated": date
            }
        }, {
            arrayFilters: [{
                'element.book_id': idBook
            }]
        });
        res.send(`Data filter updated`);
    } catch (err) {
        res.send(`Error update book filter : ${err.message}`);
    }
});


// insert data from parameters
router.post('/insert-book-shelf', async (req, res) => {
    try {
        // destruct query
        const {
            name,
            id,
            date
        } = req.query;

        // store the result in variable
        const saveBook = new BookShelf({
            book_shelf_name: name,
            book_list: {
                book_id: id,
                date_updated: date
            },
        });

        // save into database
        const result = await saveBook.save();

        // send respond to server data is inserted
        res.send(`Data inserted`);
        // res.json(saveBook);
    } catch (err) {
        res.send(`Error insert book : ${err.message}`);
    }
});


// insert book into shelf
router.post('/insert-book', async (req, res) => {
    try {
        // destruct query
        const {
            idShelf,
            idBook,
            date
        } = req.query;

        // insert book using updateOne method
        const result = await BookShelf.updateOne({
            _id: idShelf
        }, {
            $addToSet: {
                book_list: {
                    book_id: idBook,
                    date_updated: date
                }

            }
        });
        res.send(`Book Inserted`);
    } catch (err) {
        res.send(`Error insert book : ${err.message}}`);
    }
});

// update book in bookshelf
// router.put('/update-book', async (req, res) => {

//     // update book using updateOne
//     try {

//         // destruct query
//         const {
//             idBookSearch,
//             idShelf,
//             idBookNew
//         } = req.query;

//         // pull the value to update
//         const resultPull = await BookShelf.updateOne({
//             _id: idShelf
//         }, {
//             $pullAll: {
//                 book_list: [idBookSearch]
//             }
//         });

//         // add new book to array
//         const resultPush = await BookShelf.updateOne({
//             _id: idShelf
//         }, {
//             $addToSet: {
//                 book_list: idBookNew
//             }
//         });
//         res.send(`Book Updated`);
//     } catch (err) {
//         console.log(`Error update book ${err.message}`);
//     }
// });

// update book shelf
router.put('/update-book-shelf', async (req, res) => {
    try {
        // destruct query
        const {
            id,
            name
        } = req.query;

        // update library name 
        const result = await BookShelf.findByIdAndUpdate(id, {
            book_shelf_name: name
        }, {
            new: true
        });

        res.send(`Book Shelf Updated`);
    } catch (er) {
        res.send(`Error update book shelf ${err.message}`);
    }
});

// delete book in book shelf
router.delete('/delete-book/:idShelf/:idBook', async (req, res) => {
    try {
        // destruct params
        const {
            idShelf,
            idBook
        } = req.params;

        // delete book
        const result = await BookShelf.findOneAndUpdate({
            _id: idShelf
        }, {
            $pull: {
                book_list: {
                    book_id: idBook
                }
            }
        }, {
            new: true
        });
        res.send(`Book id ${idBook} deleted`);
    } catch (er) {
        res.send(`Error deleting book : ${er.message}`);
    }
});

// delete book shelf 
router.delete('/delete-book-shelf/:id', async (req, res) => {

    try {
        // destruct id from params
        const {
            id
        } = req.params;

        // delete book shelf
        const result = await BookShelf.findByIdAndDelete(id);
        res.send(`Book Shelf id ${id} is deleted`);
    } catch (err) {
        res.send(`Error delete book shelf : ${err.message}`);
    }
});