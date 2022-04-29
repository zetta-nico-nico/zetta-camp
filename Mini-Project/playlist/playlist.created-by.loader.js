// import dataloader
const DataLoader = require('dataloader');

// import user model
const UserModel = require('../user/user.model');

// load user data
const loadUserPlaylist = async function (userIds) {
    const userList = await UserModel.find({
        _id: {
            $in: userIds
        }
    });

    // define user map
    const userMap = {};
    // insert data into map
    userList.forEach(user => {
        userMap[user._id] = user;
    });

    return userIds.map(id => userMap[id]);
};

const playlistLoader = new DataLoader(loadUserPlaylist);
module.exports = playlistLoader;