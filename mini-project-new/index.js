// import express
const express = require('express');

// import mongoose
const mongoose = require('mongoose');

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