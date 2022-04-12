// 3 functions

// promise for make the string if promise is resolved
const bookPromise = (bookName, bookStock) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`There are ${bookStock} ${bookName} books left in stock, you get this book now`);
        }, 1000);
    })
};

// call the promise
// console.log(bookPromise('Nico', 5));

// 1. Looping to output until the book sold out
const bookLoop = async (bookName, bookStock) => {
    for (let i = bookStock; i >= 0; i--) {
        let resultLoop = await bookPromise(bookName, i);
        console.log(resultLoop);
    }
}

// call the bookLoop function
// bookLoop('Harry Potter', 5);

// // 2. Call first functions then display console after book sold out
const bookSoldOut = async (bookName, bookStock) => {
    const bookLoopResult = await bookLoop(bookName, bookStock);
    console.log(`${bookName} are sold out !`);
}

// call bookSoldOut function
bookSoldOut('Harry Potter', 5);

// // 3. Call first functions while the book is reduced
const bookLog = async (bookName, bookStock) => {
    const bookLoopResult = bookLoop(bookName, bookStock);
    console.log(`Book ${bookName} Left : ${bookStock}`);
};

// call bookLog function
// bookLog('Harry Potter', 5);