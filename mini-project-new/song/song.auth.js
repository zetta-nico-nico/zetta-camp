// import song model
const SongModel = require('./song.model');

// import user model
const UserModel = require('../user/user.model');

// import mongoose
const mongoose = require('mongoose');

// import jwt
const jwt = require('jsonwebtoken');


// ======================= Authorization =======================
// created by id from token
// only login can insert song
// insert song auth
const insertSongAuth = async function (resolver, parent, {
    songlist_input
}, context) {
    try {
        // get token
        const token = context.req.get('Authorization');
        // console.log(token);

        // check if token is empty or notes
        if (!token) {
            throw new Error('Token required');
        } else {
            // check token is valid or not
            const decode = jwt.verify(token, 'nico');
            // console.log(decode);

            // check if the user token is administrator or not
            const checkAdmin = await UserModel.find({
                email: decode.email
            });
            // console.log(checkAdmin);
            if (checkAdmin[0].user_type === 'Administrator') {
                // add key created by in songlist input
                songlist_input.created_by = mongoose.Types.ObjectId(checkAdmin[0].id);
                // console.log(songlist_input);
            } else {
                throw new Error(`You are not administrator`);
            };
        };
        return resolver();
    } catch (err) {
        throw new Error(`Error inserting song auth : ${err.message}`);
    };
};

// auth update song
// use token to validate user
// only user created song cad update
const updateSongAuth = async function (resolver, parent, {
    songlist_input
}, context) {
    try {
        // destruct songlist input
        const {
            song_id
        } = songlist_input
        // console.log(song_id);
        // get token
        const token = context.req.get('Authorization');
        // console.log(token);

        // check if token is empty or not
        if (!token) {
            throw new Error('Token required');
        } else {
            // check if token is valid or not
            const decode = jwt.verify(token, 'nico');
            // console.log(decode);

            // get user id from token
            const getUser = await UserModel.find({
                email: decode.email
            });
            // console.log(getUser);

            // convert user id to object id
            const creatorId = mongoose.Types.ObjectId(getUser[0]._id);

            // check if song created by user
            const checkSong = await SongModel.find({
                _id: song_id,
                created_by: creatorId
            });
            // console.log(checkSong);

            // check if result is empty
            if (Object.keys(checkSong).length === 0) {
                throw new Error('You are not song creator');
            } else {
                // add token to input
                songlist_input.token = token;
                // console.log(songlist_input);
            };
        };
        return resolver();

    } catch (err) {
        throw new Error(`Error updating song auth : ${err.message}`);
    };
};

// delete song data 
// only login user can access
// only delete own song data
const deleteSongAuth = async function (resolver, parent, {
    songlist_input
}, context) {
    try {
        // destruct songlist input
        const {
            song_id
        } = songlist_input;
        // console.log(song_id);

        // get token
        const token = context.req.get('Authorization');
        // console.log(token);

        // check if token is empty or not
        if (!token) {
            throw new Error(`Token required`);
        } else {
            // check if token is valid or not
            const decode = jwt.verify(token, 'nico');
            // console.log(decode);

            // get user id from token
            const getUser = await UserModel.find({
                email: decode.email
            });
            // console.log(getUser);

            // convert id user into object id
            const creatorId = mongoose.Types.ObjectId(getUser[0]._id);
            // console.log(creatorId);

            // check song if created by user
            const checkSong = await SongModel.find({
                _id: song_id,
                created_by: creatorId
            });
            // console.log(checkSong);

            // if song is not created by user
            // throw error
            if (Object.keys(checkSong).length === 0) {
                throw new Error(`You can't delete another user song`);
            } else {
                // add token to input
                songlist_input.token = token;
                // console.log(songlist_input);
            }
        };
        return resolver();
    } catch (err) {
        throw new Error(`Error deleting song auth : ${err.message}`);
    };
};



// export auth
module.exports = {
    Mutation: {
        insertSongList: insertSongAuth,
        updateSong: updateSongAuth,
        deleteSong: deleteSongAuth,
    }
};