// import dataloader
const DataLoader = require('dataloader');

// import user model
const UserModel = require('../user/user.model');

// load user data
const loadCollaboratorPlaylist = async function (collaboratorIds) {
    const collaboratorList = await UserModel.find({
        _id: {
            $in: collaboratorIds
        }
    });

    // define user map
    const collaboratorMap = {};
    // insert data into map
    collaboratorList.forEach(collaborator => {
        collaboratorMap[collaborator._id] = collaborator;
    });

    return userIds.map(id => userMap[id]);
};

const playlistLoader = new DataLoader(loadCollaboratorPlaylist);
module.exports = playlistLoader;