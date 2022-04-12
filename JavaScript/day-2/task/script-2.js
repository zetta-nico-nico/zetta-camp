const bookReady = (bookName, bookTotal) => `There are ${bookTotal} ${bookName} books left in stock, you ${bookTotal <= 3 ? "can't" : "can" } get this book now`;

console.log(bookReady("Harry Potter", 5));
console.log(bookReady("Harry Potter", 3));