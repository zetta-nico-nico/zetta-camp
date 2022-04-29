// import express
const express = require('express');

// import model, typedef and resolver
const UserModel = require('./user.model');

// import typedef
const typedefs = require('./user.typedef');

// import resolver
const resolvers = require('./user.resolver');

module.export = {
    UserModel,
    typedefs,
    resolvers
};