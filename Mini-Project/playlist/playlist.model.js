// import mongoose
const mongoose = require('mongoose');

// define Schema
const Schema = mongoose.Schema;

// make new playlist schema
const playlistSchema = new Schema({
    playlist_name: String,
    song_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'songlists'
    }],
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    collaborator_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }]
});

module.exports = mongoose.model('playlists', playlistSchema);