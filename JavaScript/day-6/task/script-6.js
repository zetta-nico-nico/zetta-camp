// call fs
const fs = require('fs').promises;

// call events emitter
const events = require('events');
const eventEmitter = new events.EventEmitter();


// try to read data
const readData = fileName => {

    const dataResult = fs.readFile(fileName).catch(err => console.log(err.message));
    return dataResult;
};

// Try display text in console BEFORE the text from file displayed in console
const beforeText = dataPromise => {
    console.log('Start Progress');
    dataPromise
        .then((result) => console.log(result.toString()))
        .catch((err) => console.log(err.message))
        .finally(() => console.log('Finished Progress'));
    console.log('Before Text');
};
// beforeText(readData('./text.txt'));

// another version with using eventHandler
const beforeTextHandler = readData => {
    console.log('Start Progress');
    const dataResult = fs.readFile(readData)
        .then((result) => console.log(result.toString()))
        .catch((err) => console.log(err.message))
        .finally(() => console.log('Finished Progress'));
    console.log('Before Text');
    return dataResult;
};

// Try display text in console AFTER the text from file displayed in console
const afterText = dataPromise => {
    console.log('Start Progress');
    dataPromise
        .then((result) => {
            console.log(result.toString());
            console.log('After text');
        })
        .catch((err) => console.log(err.message))
        .finally(() => console.log('Finished Progress'));
};

// another version with using eventHandler
const afterTextHandler = readData => {
    console.log('Start Progress');
    const dataResult = fs.readFile(readData)
        .then((result) => {
            console.log(result.toString());
            console.log('After Text');
        })
        .catch((err) => console.log(err.message))
        .finally(() => console.log('Finished Progress'));

    return dataResult;
};
// afterText(readData('./text.txt'));

// create event handlers
// for readData
eventEmitter.on('read', readData);

// for make output 
// before file
eventEmitter.on('before', beforeTextHandler);

// after file
eventEmitter.on('after', afterTextHandler);


// call the before text with parameter txt directory
// eventEmitter.emit('before', './text.txt');

// call the after text with parameter txt directory
eventEmitter.emit('after', './text.txt');



// Try creating a function that read a text file, then display the text file with:
// 1. Try display text in console BEFORE the text from file displayed in console
// 2. Try display text in console AFTER the text from file displayed in console