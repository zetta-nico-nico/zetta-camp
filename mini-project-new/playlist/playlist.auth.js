// import song model
const SongModel = require('../song/song.model');

// import user model
const UserModel = require('../user/user.model');

// import playlist model
const PlaylistModel = require('../playlist/playlist.model');

// import mongoose
const mongoose = require('mongoose');

// import jwt
const jwt = require('jsonwebtoken');

// get all playlist auth
const getAllPlaylistAuth = async function (resolver, parent, args, context) {
    try {
        // get token
        const token = context.req.get('Authorization');
        // console.log(token);

        // check if token is valid or not
        if (!token) {
            throw new Error(`Token required`);
        } else {
            // check if token is valid or not
            const decode = jwt.verify(token, 'nico');
            // console.log(decode);

            // get user data 
            const getUser = await UserModel.find({
                email: decode.email
            });
            // console.log(getUser);

            // pass user id to args
            args.token = mongoose.Types.ObjectId(getUser[0]._id);
            // console.log(args.token);
        };

        return resolver();
    } catch (err) {
        throw new Error(`Error get all playlist : ${err.message}`);
    }
};

// insert playlist auth
// only creator
// token used
// created by from token
const insertPlaylistAuth = async function (resolver, parent, {
    playlist_input
}, context) {
    try {

        // get token
        const token = context.req.get('Authorization');
        // console.log(dataToken);

        // if token is not exists
        if (!token) {
            throw new Error(`Token required`);
        } else {
            // check if token is valid or not
            const decode = jwt.verify(token, 'nico');

            // get user data
            const getUser = await UserModel.find({
                email: decode.email
            });
            // console.log(getUser);

            // check if user is creator or not
            if (getUser[0].user_type === 'Creator') {
                // convert id into object id
                const creatorId = mongoose.Types.ObjectId(getUser[0]._id);
                // console.log(creatorId);

                // insert id into created by 
                playlist_input.created_by = creatorId;

                // push creator id into collaborator
                playlist_input.collaborator_ids.push(creatorId);
                // console.log(playlist_input);
            } else {
                throw new Error(`You are not creator`);
            }
        };
        return resolver();
    } catch (err) {
        throw new Error(`Error inserting playlist auth : ${err.message}`);
    }

};

// add and remove song mutation
// only user can do it
// collaborator can add song
// other user throw error not creator/collaborator
const songPlaylistAuth = async function (resolver, parent, {
    playlist_input
}, context) {
    try {
        // destruct playlist input
        const {
            playlist_id,
            song_id
        } = playlist_input;
        // console.log(playlist_id, song_id);

        // get token 
        const token = context.req.get('Authorization');

        // check if token is empty or not
        if (!token) {
            throw new Error(`Token required`);
        } else {
            // check if token is valid or not
            const decode = jwt.verify(token, 'nico');
            // console.log(decode);

            // get user data from token
            const getUser = await UserModel.find({
                email: decode.email
            });
            // console.log(getUser);

            // convert id user into object id 
            const creatorId = mongoose.Types.ObjectId(getUser[0]._id);
            // console.log(creatorId);

            // check if user who make the playlist
            const checkPlaylist = await PlaylistModel.find({
                _id: playlist_id,
                $or: [{
                        created_by: creatorId
                    },
                    {
                        collaborator_ids: creatorId,
                    }
                ]
            });
            // console.log(checkPlaylist);

            // check if result is empty or not
            if (Object.keys(checkPlaylist).length === 0) {
                throw new Error('Only creator or/collaborator can add/remove the song');
            } else {
                playlist_input.token = token;
            };
        };

        return resolver();

    } catch (err) {
        throw new Error(`Error mutation song : ${err.message}`);
    };
};


// add and remove collaborator
// user created playlist only can add
// outside user throw error
const collaboratorPlaylistAuth = async function (resolver, parent, {
    playlist_input
}, context) {
    try {
        // destruct playlist input
        const {
            playlist_id,
            song_id
        } = playlist_input;
        // console.log(playlist_id, song_id);

        // get token 
        const token = context.req.get('Authorization');

        // check if token is empty or not
        if (!token) {
            throw new Error(`Token required`);
        } else {
            // check if token is valid or not
            const decode = jwt.verify(token, 'nico');
            // console.log(decode);

            // get user data from token
            const getUser = await UserModel.find({
                email: decode.email
            });
            // console.log(getUser);

            // convert id user into object id
            const creatorId = mongoose.Types.ObjectId(getUser[0]._id);
            // console.log(creatorId);
            // check if user who make the playlist
            const checkPlaylist = await PlaylistModel.find({
                _id: playlist_id,
                created_by: creatorId
            });
            // console.log(checkPlaylist);

            // check if playlist is empty or not
            if (Object.keys(checkPlaylist).length === 0) {
                throw new Error('Only playlist creator can add/remove collaborator');
            } else {
                playlist_input.token = token;
            };
        };
        return resolver();
    } catch (err) {
        throw new Error(`Error mutation song : ${err.message}`);
    }
};

module.exports = {
    Query: {
        getAllPlaylist: getAllPlaylistAuth,
    },
    Mutation: {
        insertPlaylist: insertPlaylistAuth,
        insertSong: songPlaylistAuth,
        deleteSongPlaylist: songPlaylistAuth,
        insertCollaborator: collaboratorPlaylistAuth,
        deleteCollaboratorPlaylist: collaboratorPlaylistAuth
    }
}