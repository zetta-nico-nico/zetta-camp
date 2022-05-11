// import model
const userModel = require('./user.model');

// import schema
const userTypedefs = require('./user.typedefs');

// import resolver
const userResolver = require('./user.resolver');

// import auth
const userAuth = require('./user.auth');
// console.log(userAuth);

// export model, schema, and resolver
module.exports = {
    userTypedefs,
    userResolver,
    userModel,
    userAuth,
};