// import dataloader
const DataLoader = require('dataloader');

// import User model
// const SonglistModel = require('./song-list.model');
const UserModel = require('../user/user.model');

const loadUserSong = async function (userIds) {
    const userLists = await UserModel.find({
        _id: {
            $in: userIds
        }
    });

    // console.log(userIds);

    // define map
    const userMap = {};

    // insert data into map
    userLists.forEach((user) => {
        userMap[user._id] = user;
    });

    return userIds.map(id => userMap[id]);
};

const songListLoader = new DataLoader(loadUserSong);
module.exports = songListLoader;