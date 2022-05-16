// import model
const PlaylistModel = require('./playlist.model');

// ======================= Playlist =======================
// ======================= Mutation =======================
// input playlist 
const insertPlaylist = async function (parent, {
    playlist_input
}, context) {
    try {
        // check if there is an input or not
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_name,
                song_ids,
                collaborator_ids
            } = playlist_input;
            // console.log(playlist_name, song_ids, collaborator_ids);

            // save user id from token
            const userId = context.user[0]._id;
            // console.log(userId);

            // save input to new model
            const newPlaylist = new PlaylistModel({
                playlist_name: playlist_name,
                song_ids: song_ids,
                created_by: userId,
                collaborator_ids: collaborator_ids
            });

            const result = await newPlaylist.save();
            return result;
        };
    } catch (err) {
        throw new Error(`Error input playlist : ${err.message}`);
    };
};


// insert song with playlist id and song id
const insertSong = async function (parent, {
    playlist_input
}, context) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_id,
                song_id
            } = playlist_input;
            // console.log(song_id);    

            // save user id from context
            const userId = context.user[0]._id;
            // console.log(userId);

            // check if user who make the playlist or the collaborator
            const checkPlaylist = await PlaylistModel.find({
                _id: playlist_id,
                $or: [{
                    created_by: userId
                }, {
                    collaborator_ids: userId,
                }]
            });
            // console.log(checkPlaylist);

            // check if any playlist in check playlist
            if (Object.keys(checkPlaylist).length === 0) {
                throw new Error('Only creator or/collaborator can add/remove the song');
            } else {
                // insert data with method updateOne and add new song
                const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
                    $addToSet: {
                        song_ids: song_id
                    }
                }, {
                    new: true
                });
                return result;
            };


        };
    } catch (err) {
        throw new Error(`Error inserting playlist : ${err.message}`);
    };
};

// add collaborator with playlist id and user id
const insertCollaborator = async function (parent, {
    playlist_input
}, context) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_id,
                user_id
            } = playlist_input;
            // console.log(playlist_id, user_id);

            // store user id from context
            const userId = context.user[0]._id;
            // console.log(userId);

            // check if playlist created by login user
            const checkPlaylist = await PlaylistModel.find({
                _id: playlist_id,
                created_by: userId
            });
            // console.log(checkPlaylist);

            // check if playlist in database
            if (Object.keys(checkPlaylist).length === 0) {
                throw new Error('Only playlist creator can add/remove collaborator');
            } else {
                // add collaborator to existing playlist
                const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
                    $addToSet: {
                        collaborator_ids: user_id
                    }
                }, {
                    new: true
                });
                return result;
            }

        };
    } catch (err) {
        throw new Error(`Error inserting playlist : ${err.message}`);
    };
};


// remove song from playlist
const deleteSongPlaylist = async function (parent, {
    playlist_input
}, context) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_id,
                song_id
            } = playlist_input;
            // console.log(playlist_input);

            // save user id from context
            const userId = context.user[0]._id;
            // console.log(userId);

            // check if user who make the playlist or the collaborator
            const checkPlaylist = await PlaylistModel.find({
                _id: playlist_id,
                $or: [{
                    created_by: userId
                }, {
                    collaborator_ids: userId,
                }]
            });
            // console.log(checkPlaylist);

            // check if any playlist in check playlist
            if (Object.keys(checkPlaylist).length === 0) {
                throw new Error('Only creator or/collaborator can add/remove the song');
            } else {
                // get data by findbyid method
                // pull song
                const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
                    $pull: {
                        song_ids: song_id
                    }
                }, {
                    new: true
                });
                // console.log(result);
                return result;
            };
        };
    } catch (err) {
        throw new Error(`Error removing song playlist : ${err.message}`);
    };
};

// remove collaborator from playlist
const deleteCollaboratorPlaylist = async function (parent, {
    playlist_input
}, context) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_id,
                user_id
            } = playlist_input;
            // console.log(playlist_id, user_id);

            // store user id from context
            const userId = context.user[0]._id;
            // console.log(userId);

            // check if playlist created by login user
            const checkPlaylist = await PlaylistModel.find({
                _id: playlist_id,
                created_by: userId
            });
            // console.log(checkPlaylist);

            // check if playlist in database
            if (Object.keys(checkPlaylist).length === 0) {
                throw new Error('Only playlist creator can add/remove collaborator');
            } else {
                // find data using findbyid
                // pull collaborator that match the user id
                const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
                    $pull: {
                        collaborator_ids: user_id
                    }
                }, {
                    new: true
                });
                // console.log(result);
                return result;
            };
        };
    } catch (err) {
        throw new Error(`Error removing collaborator playlist : ${err.message}`);
    }
};

// ======================= Query =======================
// get all playlist data
const getAllPlaylist = async function (parent, args, context) {
    try {
        // console.log(context.user);
        // get id from context
        const userId = context.user[0]._id;
        // console.log(userId);

        // get all data using find method
        const result = await PlaylistModel.find({
            $or: [{
                    created_by: userId
                },
                {
                    collaborator_ids: userId
                }
            ]

        });
        return result;
    } catch (err) {
        throw new Error(`Error getting all playlist ${err.message}`);
    };
};

// get playlist data base on id
const getPlaylistById = async function (parent, {
    playlist_input
}) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_id
            } = playlist_input;
            // console.log(playlist_id);
            // find data using findbyid method
            const result = await PlaylistModel.findById(playlist_id);
            // console.log(result);
            return result;
        };
    } catch (err) {
        throw new Error(`Error get playlist id ${err.message}`);
    }
};

// sort playlist base on playlist name and creator name
const getPlaylistFilter = async function (parent, {
    playlist_input
}) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_name,
                song_name,
                creator_name
            } = playlist_input;
            // console.log(playlist_name, song_name, creator_name);
            // make regex for each data
            // for playlist name
            const regPlaylistName = new RegExp(playlist_name, 'i');

            // for song name
            const regSongName = new RegExp(song_name, 'i');

            // for creator name
            const regCreatorName = new RegExp(creator_name, 'i');
            // console.log(regCreatorName, regCreatorName, regSongName);

            // look up to song and user
            // get data base on regex
            const result = await PlaylistModel.aggregate([{
                    $lookup: {
                        from: 'songlists',
                        localField: 'song_ids',
                        foreignField: '_id',
                        as: 'song_data'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'user_data'
                    }
                },
                {
                    $match: {
                        'playlist_name': {
                            $regex: regPlaylistName,
                        },
                        'song_data.name': {
                            $regex: regSongName
                        },
                        'user_data.name': {
                            $regex: regCreatorName
                        }
                    }
                }
            ]);
            // console.log(result);
            return result;
        };
    } catch (err) {
        throw new Error(`Error sorting playlist ${err.message}`);
    }
};

// get sorted data base on playlist name and creator name
const getPlaylistSort = async function (parent, {
    playlist_input
}) {
    try {
        if (!playlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct playlist input
            const {
                playlist_name,
                creator_name
            } = playlist_input;

            // check if there is playlist name input
            if (playlist_name) {
                // convert playlist name
                const sortPlaylistName = playlist_name === 'asc' ? 1 : -1;

                // lookup data to get creator name
                // sort data with playlist name and creator name
                const result = await PlaylistModel.aggregate([{
                        $lookup: {
                            from: 'users',
                            localField: 'created_by',
                            foreignField: '_id',
                            as: 'user_data'
                        }
                    },
                    {
                        $sort: {
                            playlist_name: sortPlaylistName,
                        }
                    }
                ]);
                return result;
            } else
            if (creator_name) {
                // convert creator name
                const sortCreatorName = creator_name === 'asc' ? 1 : -1;


                // lookup data to get creator name
                // sort data with playlist name and creator name
                const result = await PlaylistModel.aggregate([{
                        $lookup: {
                            from: 'users',
                            localField: 'created_by',
                            foreignField: '_id',
                            as: 'user_data'
                        }
                    },
                    {
                        $sort: {
                            'user_data.name': sortCreatorName
                        }
                    }
                ]);
                return result;
            }
            // if there is no input
            // output all
            else {
                const result = await PlaylistModel.aggregate([{
                    $lookup: {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'user_data'
                    }
                }]);
                return result;
            };
        };
    } catch (err) {
        throw new Error(`Error getting sort playlist : ${err.message}`);
    }
};


// ======================= Loader =======================
// get user data playlist
const getPlaylistCreatedByLoader = async function (parent, args, context) {
    // console.log(parent.created_by);
    if (parent.created_by) {
        return await context.PlaylistCreatedByLoader.load(parent.created_by);
    };
};

// get song data playlist
const getPlaylistSongLoader = async function (parent, args, context) {
    // console.log(parent.song_ids);
    if (parent.song_ids) {
        return await context.PlaylistSongLoader.loadMany(parent.song_ids);
    }
};

// get collaborator data playlist
const getPlaylistCollaboratorLoader = async function (parent, args, context) {
    // console.log(parent.collaborator_ids);
    if (parent.collaborator_ids) {
        return await context.PlaylistCollaboratorLoader.loadMany(parent.collaborator_ids);
    }
};

// export query
module.exports = {
    Query: {
        getAllPlaylist,
        getPlaylistById,
        getPlaylistFilter,
        getPlaylistSort
    },
    Mutation: {
        insertPlaylist,
        insertSong,
        insertCollaborator,
        deleteSongPlaylist,
        deleteCollaboratorPlaylist
    },
    Playlists: {
        created_by: getPlaylistCreatedByLoader,
        song_id: getPlaylistSongLoader,
        collaborator_ids: getPlaylistCollaboratorLoader
    },
};