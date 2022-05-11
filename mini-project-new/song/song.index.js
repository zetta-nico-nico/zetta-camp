// import loader
const songLoader = require('./song.loader');

// import model
const songModel = require('./song.model');

// import resolver
const songResolver = require('./song.resolver');

// import typedef
const songTypedefs = require('./song.typedefs');

// import auth
const songAuth = require('./song.auth');

// export module
module.exports = {
    songTypedefs,
    songResolver,
    songModel,
    songLoader,
    songAuth
};