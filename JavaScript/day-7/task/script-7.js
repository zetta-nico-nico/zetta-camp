// make an array
const arr = ["Harry Potter", "Sherlock Holmes", "Agatha Christie", "Sherlock Holmes"];

// make an object
const arrKey = [
    ["storeName", "Book Store"],
    ["bookAvailable", 10],
    ["Agatha Christie", 5],
    ["Harry Potter", 3],
    ["Sherlock Holmes", 2]
];

// using set
// insert data to set
const setArr = new Set();

// add arr to set
const addValueSet = (arr) => {
    for (const arrCopy of arr) {
        setArr.add(arrCopy);
    }
}

addValueSet(arr);


// output all set without loop
console.log(setArr);

// output all set with foreach loop
// setArr.forEach((setCopy) => console.log(`This is ${setCopy} book`));
// setArr.forEach((setCopy) => console.log(setCopy));

// using for of
// for (const setCopy of setArr) {
//     console.log(`This is ${setCopy} book`);
// }
// for (const setCopy of setArr) {
//     console.log(setCopy);
// }



// using Map
const mapArr = new Map();

// add arr to map
const addValueMap = arr => {
    for (const [key, value] of arr) {
        mapArr.set(key, value);
    }
}

addValueMap(arrKey);


// log the map result
console.log(mapArr);
// destruct map
// const [key, value] = mapArr;
// console.log(key, value);

// output map using loop
// for (const [key, value] of mapArr) {
//     console.log(key, value);
// }