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

// import song list loader
const SongListLoader = require('./song/song.loader');

// import playlist created by loader
const PlaylistCreatedByLoader = require('./playlist/playlist.createdby.loader');

// import playlist song list
const PlaylistSongLoader = require('./playlist/playlist.song.loader');

// import playlist collaborator list
const PlaylistCollaboratorLoader = require('./playlist/playlist.collaborator.loader');

// import authentication
const userAuthentication = require('./middleware/auth');

// import user data
// destruct user index
const {
    userTypedefs,
    userResolver,
    userModel,
    userAuth
} = require('./user/user.index');
// console.log(User);

// import song data
// destruct song index
const {
    songTypedefs,
    songResolver,
    songModel,
    songAuth
    // songLoader
} = require('./song/song.index');
// console.log(songModel);

// import playlist data
// destruct playlist index
const {
    playlistTypedefs,
    playlistResolver,
    playlistModel,
    playlistAuth
    // playlistCollaboratorLoader,
    // playlistCreatedByLoader,
    // playlistSongLoader
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

// define middleware
let authMiddleware = {};

// define all middleware
authMiddleware = merge(
    // userAuth,
    // songAuth,
    // playlistAuth
    userAuthentication
);
// console.log(authMiddleware);

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

// use apollo server
const server = new ApolloServer({
    schema: protectedSchema,
    typeDefs,
    resolvers,
    context: function ({
        req
    }) {
        req: req;
        return {
            SongListLoader,
            PlaylistCollaboratorLoader,
            PlaylistCreatedByLoader,
            PlaylistSongLoader,
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