// import express
const express = require('express');

// import mongoose
const mongoose = require('mongoose');

// define lodash
const {
    merge
} = require('lodash');

// import apollo server
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const {
    applyMiddleware
} = require('graphql-middleware');

const {
    makeExecutableSchema
} = require('graphql-tools');

// use express
const app = express();

// define port 
const port = 8080;

// define database name
const mongoDB = 'mongodb://127.0.0.1/zetta-camp';

// connect to mongodb
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log(`Error connect mongodb ${err.message}`);
    } else {
        console.log(`Connected to database`);
    }
});


// import user data
// destruct user index
const {
    userTypedefs,
    userResolver,
    userModel
} = require('./user/user.index');
// console.log(User);

// import song data
// destruct song index
const {
    songTypedefs,
    songResolver,
    songModel,
    songLoader
} = require('./song/song.index');
// console.log(songModel);

// import playlist data
// destruct playlist index
const {
    playlistTypedefs,
    playlistResolver,
    playlistModel,
    playlistCollaboratorLoader,
    playlistCreatedByLoader,
    playlistSongLoader
} = require('./playlist/playlist.index');
// console.log(playlistModel);

// define typedefs
const typeDef = gql `
type Query,
type Mutation
`;

// define all typedefs
const typeDefs = [
    typeDef,
    userTypedefs,
    songTypedefs,
    playlistTypedefs
];
// console.log(typeDefs);

// define resolvers
let resolvers = {};

// define all resolvers
resolvers = merge(
    resolvers,
    userResolver,
    songResolver,
    playlistResolver
);
// console.log(resolvers);


// use apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: function ({
        req
    }) {
        req: req;
        return {
            songLoader,
            playlistCollaboratorLoader,
            playlistCreatedByLoader,
            playlistSongLoader,
            req
        };
    }
});

// run apollo server
server.start().then(res => {
    server.applyMiddleware({
        app
    });
    // run port 
    app.listen(port, () => {
        console.log(`App running in port ${port}`);
    });
});