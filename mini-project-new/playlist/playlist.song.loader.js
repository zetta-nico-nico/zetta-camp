// import dataloader
const DataLoader = require('dataloader');

// import song model
const SongModel = require('../song/song.model');

// load user data
const loadSongPlaylist = async function (songIds) {
    const songLists = await SongModel.find({
        _id: {
            $in: songIds
        }
    });

    // console.log(songIds);
    // console.log(songLists);

    // define song map
    const songMap = {};

    // insert data into map
    songLists.forEach(song => {
        songMap[song._id] = song;
    });
    return songIds.map(id => songMap[id]);
};

const playlistLoader = new DataLoader(loadSongPlaylist);
module.exports = playlistLoader;