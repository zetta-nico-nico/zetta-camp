// import model
const playlistModel = require('./playlist.model');

// import collaboratorloader
const playlistCollaboratorLoader = require('./playlist.collaborator.loader');

// import created by loader
const playlistCreatedByLoader = require('./playlist.createdby.loader');

// import song loader
const playlistSongLoader = require('./playlist.song.loader');

// import resolver
const playlistResolver = require('./playlist.resolver');

// import typedefs
const playlistTypedefs = require('./playlist.typedefs');

// export data
module.exports = {
    playlistTypedefs,
    playlistResolver,
    playlistModel,
    playlistCollaboratorLoader,
    playlistCreatedByLoader,
    playlistSongLoader
};