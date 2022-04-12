// declare book object
let bookList = {
    bookName: 'Harry Potter',
    bookStock: 3,
};


// function to output 
const bookAvaliable = (bookName = "Harry Potter", bookStock = 5) => console.log(`There are ${bookStock} ${bookName} books left in stock, you ${bookStock <= 3 ? "can't" : "can" } get this book now`);

// without parameter
bookAvaliable();

// destructure book object
const {
    bookName: nameBook,
    bookStock: stockBook
} = bookList;

// output of destructure
// console.log(nameBook, stockBook);

// output function with destructure variable from object
bookAvaliable(nameBook, stockBook);