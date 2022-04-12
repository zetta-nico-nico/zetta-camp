const bookReady = (bookName, bookTotal) => `There are ${bookTotal} ${bookName} books left in stock`;

console.log(bookReady("Harry Potter", 5));
console.log(bookReady("Harry Potter", "10"));

const bookName1 = 'Sherlock Holmes';
let number = '12';
let number2 = +number + 3;
console.log(bookReady(bookName1, number2));