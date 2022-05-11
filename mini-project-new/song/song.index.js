// import loader
const songLoader = require('./song.loader');

// import model
const songModel = require('./song.model');

// import resolver
const songResolver = require('./song.resolver');

// import typedef
const songTypedefs = require('./song.typedefs');

// export module
module.exports = {
    songTypedefs,
    songResolver,
    songModel,
    songLoader
};