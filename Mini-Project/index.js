// import express
const express = require('express');

// import mongoose
const mongoose = require('mongoose');

// import apollo server
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

// import bcrypt
const bcrypt = require('bcrypt');

// import user model
const UserModel = require('./user/user.model');

// import song list model
const SonglistsModel = require('./song-list/song-list.model');

// import playlist model
const PlaylistModel = require('./playlist/playlist.model');

// import song list loader
const SongListLoader = require('./song-list/song-list.loader');

// import playlist created by loader
const PlaylistCreatedByLoader = require('./playlist/playlist.created-by.loader');

// import playlist song list
const PlaylistSongLoader = require('./playlist/playlist.song.loader');

// import playlist collaborator list
const PlaylistCollaboratorLoader = require('./playlist/playlist.collaborator.loader');

// use express
const app = express();

// define port 
const port = 8080;

// define database name
const mongoDB = 'mongodb://127.0.0.1/zetta-camp';

// connect to mongodb
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log(`Error connect mongodb ${err.message}`);
    } else {
        console.log(`Connected to database`);
    }
});

// // import usermodel, typedef, and resolver
// const data = require('./user/index');
const typeDefs = gql `
type Users{
    id: ID
    name: String
    email: String
    hashed_password: String
    user_type: user_type_enum
}

type SongLists{
    id: ID
    name: String
    genre: String,
    duration: Int,
    created_by: Users
}

type Playlists{
    id: ID
    playlist_name: String
    song_id: [SongLists]
    created_by: Users
    collaborator_ids: [Users]
}

type SongId{
    song_id: Users
}
enum user_type_enum{
    Administrator
    Creator
    Enjoyer
}

enum SortingList{
    asc
    desc
}

input UserInput{
    name: String
    email: String
    password: String,
    user_type: user_type_enum
}

input UserSearchInput{
    user_id: ID
}

input UserFilterInput{
    name: String,
    user_type: user_type_enum
}

input UserSortingInput{
    name: SortingList!
}

input SongListInput{
    name: String
    genre: String,
    duration: Int,
    created_by: ID
}

input SearchSongInput{
    song_id: ID
}

input SongListFilterInput{
    name: String
    genre: String
    creator_name: String
}


input SongListSortInput{
    name: SortingList
    genre: SortingList
    creator_name: SortingList!
}

input LoginUserInput{
    name: String!,
    password: String!
}

input PlaylistInput{
    playlist_name: String
    song_ids: [ID]
    created_by: ID
    collaborator_ids: [ID]
}

input PlaylistIdInput{
    playlist_id: ID
}

input PlaylistSongInput{
    playlist_id: ID
    song_id: ID
}

input PlaylistCollaboratorInput{
    playlist_id: ID
    user_id: ID
}

input PlaylistFilterInput{
    playlist_name: String
    song_name: String
    creator_name: String  
}

input PlaylistSortInput{
    playlist_name: SortingList!
    creator_name: SortingList!
}


type Mutation{
    insertUser(user_input: UserInput) : Users
    insertSongList(songlist_input: SongListInput) : SongLists
    insertPlaylist(playlist_input: PlaylistInput): Playlists
    insertSong(playlist_input: PlaylistSongInput): Playlists
    insertCollaborator(playlist_input: PlaylistCollaboratorInput) : Playlists
    deleteSongPlaylist(playlist_input: PlaylistSongInput): Playlists
    deleteCollaboratorPlaylist(playlist_input:PlaylistCollaboratorInput ): Playlists
}
type Query{
    getAllUsers: [Users]
    getAllUserFilter(user_input: UserFilterInput): [Users]
    getUserById(user_input: UserSearchInput) : Users
    getUserSort(user_input: UserSortingInput): [Users]
    getAllSongs: [SongLists]
    getSongById(songlist_input: SearchSongInput): SongLists
    getSongFilter(songlist_input: SongListFilterInput): [SongLists]
    getSongSort(songlist_input: SongListSortInput): [SongLists]
    getAllPlaylist: [Playlists]
    getPlaylistById(playlist_input: PlaylistIdInput): Playlists
    getPlaylistFilter(playlist_input: PlaylistFilterInput) : [Playlists]
    getPlaylistSort(playlist_input: PlaylistSortInput): [Playlists]
    
}
`;


// ======================= Users =======================
// ======================= Mutation =======================
// insert data into database
const insertUser = async function (parent, {
    user_input
}) {
    try {
        // destruct userInput
        const {
            name,
            email,
            password,
            user_type
        } = user_input;
        // console.log(name, email, password, user_type);

        // define salt to hash password
        const salt = await bcrypt.genSalt(10);
        // generate salt to hash password
        const newPassword = await bcrypt.hash(password, salt);
        // make new model to save data
        const newUser = new UserModel({
            name: name,
            email: email,
            hashed_password: newPassword,
            user_type: user_type
        });
        const result = newUser.save();
        return result;
    } catch (err) {
        throw new Error(`Error insert user : ${err.message}`);
    };
};

// edit user data


// ======================= Query =======================
// get all user data
const getAllUsers = async function (parent) {
    try {
        // get all data using find method
        const result = await UserModel.find();
        return result;
    } catch (err) {
        throw new Error(`Error getAllUser : ${err.message}`);
    };
};

// get user data base on id
const getUserById = async function (parent, {
    user_input
}) {
    try {
        // destruct user input
        const {
            user_id
        } = user_input;

        // get user data by findbyid method
        const result = await UserModel.findById(user_id);
        return result;
    } catch (err) {
        throw new Error(`Error getUserById : ${err.message}`);
    };
};

// get all user data with filter
const getAllUserFilter = async function (parent, {
    user_input
}) {
    try {
        // destruct user input
        const {
            name,
            user_type
        } = user_input;

        console.log(user_type);
        const regName = new RegExp(name, 'i');
        console.log(regName);
        const regUserType = new RegExp(user_type, 'i');

        const result = await UserModel.find({
            name: {
                $regex: regName

            },
            user_type: {
                $regex: regUserType
            }
        });

        // const result = await UserModel.find({
        //     name: name
        // });

        // console.log(user_type);
        // console.log(result);
        return result;
    } catch (err) {
        throw new Error(`Error get all user data with filter : ${err.message}`);
    }
};


// sort data with name
const getUserSort = async function (parent, {
    user_input
}) {
    try {
        // destruct user input
        const {
            name
        } = user_input;

        // make ternary operator to define what sort will be used
        const sort = name === 'asc' ? 1 : -1;
        // console.log(sort);

        // sort data using query sort aggregate
        const result = await UserModel.aggregate([{
            $sort: {
                name: sort
            }
        }]);
        return result;
    } catch (err) {
        throw new Error(`Error sort data ${err.message}`);
    };
};


// ======================= Song List =======================
// ======================= Mutation =======================
const insertSongList = async function (parent, {
    songlist_input
}) {
    try {
        // destruct song list input
        const {
            name,
            genre,
            duration,
            created_by
        } = songlist_input;

        // console.log(name, genre, duration, created_by);

        // define new model to store input
        const newSong = new SonglistsModel({
            name: name,
            genre: genre,
            duration: duration,
            created_by: created_by
        });
        const result = await newSong.save();
        return result;
    } catch (err) {
        throw new Error(`Error insertSongList : ${err.message}`);
    };
};

// ======================= Query =======================
// get all song list data
const getAllSongs = async function (parent) {
    try {
        // get all book lists data using find method
        const result = await SonglistsModel.find();
        return result;
    } catch (err) {
        throw new Error(`Error getAllSongs : ${err.message}`);
    };
};

// get song list data base on song id
const getSongById = async function (parent, {
    songlist_input
}) {
    try {
        // destruct songlist_input
        const {
            song_id
        } = songlist_input;
        // get song using findbyid method
        const result = await SonglistsModel.findById(song_id);
        return result;
    } catch (err) {
        throw new Error(`Error getSongById : ${err.message}`);
    };
};

// get all song with creator name
const getSongFilter = async function (parent, {
    songlist_input
}) {
    try {
        // destruct songlist input
        const {
            name,
            genre,
            creator_name
        } = songlist_input;
        console.log(creator_name);

        // make all input data to regex
        // make regex name
        const regName = new RegExp(name, 'i');

        // make regex genre
        const regGenre = new RegExp(genre, 'i');

        // make regex creator name
        const regCreatorName = new RegExp(creator_name, 'i');

        // lookup user first
        // use regex to find data
        const result = await SonglistsModel.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'created_by',
                foreignField: '_id',
                as: 'song_data'
            }
        }, {
            $unwind: '$song_data'
        }, {
            $match: {
                'song_data.name': creator_name
            }
        }]);
        console.log(result);
        return result;
    } catch (err) {
        throw new Error(`Error getSongFilter : ${err.message}`);
    };
};

// get song data sort
const getSongSort = async function (parent, {
    songlist_input
}) {
    try {
        // destruct songlist input
        const {
            name,
            genre,
            creator_name
        } = songlist_input;
        // console.log(name, genre, creator_name);

        // make ternary operator to define sort used
        // sort for name
        const sortName = name === 'asc' ? 1 : -1;

        // sort for name
        const sortGenre = genre === 'asc' ? 1 : -1;

        // sort for name
        const sortCreatorName = creator_name === 'asc' ? 1 : -1;
        console.log(sortName, sortGenre, sortCreatorName);

        // sort data based on sort value using sort query aggregate
        const result = await SonglistsModel.aggregate([{
                $lookup: {
                    from: 'users',
                    localField: 'created_by',
                    foreignField: '_id',
                    as: 'data'
                }
            },
            {
                $sort: {
                    name: sortName,
                    genre: sortGenre,
                }
            }
        ]);
        // console.log(r);
        return result;
    } catch (err) {
        throw new Error(`Error getSongSort : ${err.message}`);
    };
};


// ======================= Playlist =======================
// ======================= Mutation =======================
// input playlist 
const insertPlaylist = async function (parent, {
    playlist_input
}) {
    try {
        // destruct playlist input
        const {
            playlist_name,
            song_ids,
            created_by,
            collaborator_ids
        } = playlist_input;
        // console.log(playlist_name, song_ids, created_by, collaborator_ids);

        // save input to new model
        const newPlaylist = new PlaylistModel({
            playlist_name: playlist_name,
            song_ids: song_ids,
            created_by: created_by,
            collaborator_ids: collaborator_ids
        });

        const result = await newPlaylist.save();
        return result;
    } catch (err) {
        throw new Error(`Error input playlist : ${err.message}`);
    };
};


// insert song with playlist id and song id
const insertSong = async function (parent, {
    playlist_input
}) {
    try {
        // destruct playlist input
        const {
            playlist_id,
            song_id
        } = playlist_input;
        // console.log(playlist_id, song_id);
        // const result = await PlaylistModel.updateOne({
        //     _id: playlist_id
        // }, {
        //     $addToSet: {
        //         song_ids: song_id
        //     }
        // }, {
        //     new: true
        // });
        // insert data with method updateOne and add new song
        const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
            $addToSet: {
                song_ids: song_id
            }
        }, {
            new: true
        });
        return result;
    } catch (err) {
        throw new Error(`Error inserting playlist : ${err.message}`);
    };
};

// add collaborator with playlist id and user id
const insertCollaborator = async function (parent, {
    playlist_input
}) {
    try {
        // destruct playlist input
        const {
            playlist_id,
            user_id
        } = playlist_input;
        // console.log(playlist_id, user_id);

        // insert collaborator to existing playlist
        // const result = await PlaylistModel.updateOne({
        //     _id: playlist_id,
        // }, {
        //     $addToSet: {
        //         collaborator_ids: user_id
        //     }
        // }, {
        //     new: true
        // });

        // add collaborator to existing playlist
        const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
            $addToSet: {
                collaborator_ids: user_id
            }
        }, {
            new: true
        });
        return result;
    } catch (err) {
        throw new Error(`Error inserting playlist : ${err.message}`);
    };
};


// remove song from playlist
const deleteSongPlaylist = async function (parent, {
    playlist_input
}) {
    try {
        // destruct playlist input
        const {
            playlist_id,
            song_id
        } = playlist_input;
        // console.log(playlist_input);

        // get data by findbyid method
        // pull song
        const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
            $pull: {
                song_ids: song_id
            }
        }, {
            new: true
        });
        console.log(result);
        return result;
    } catch (err) {
        throw new Error(`Error removing song playlist : ${err.message}`);
    };
};

// remove collaborator from playlist
const deleteCollaboratorPlaylist = async function (parent, {
    playlist_input
}) {
    try {
        // destruct playlist input
        const {
            playlist_id,
            user_id
        } = playlist_input;
        // console.log(playlist_id, user_id);
        // find data using findbyid
        // pull collaborator that match the user id
        const result = await PlaylistModel.findByIdAndUpdate(playlist_id, {
            $pull: {
                collaborator_ids: user_id
            }
        }, {
            new: true
        });
        console.log(result);
        return result;
    } catch (err) {
        throw new Error(`Error removing collaborator playlist : ${err.message}`);
    }
};

// ======================= Query =======================
// get all playlist data
const getAllPlaylist = async function (parent) {
    try {
        // get all data using find method
        const result = await PlaylistModel.find();
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
        // destruct playlist input
        const {
            playlist_id
        } = playlist_input;
        // console.log(playlist_id);
        // find data using findbyid method
        const result = await PlaylistModel.findById(playlist_id);
        // console.log(result);
        return result
    } catch (err) {
        throw new Error(`Error get playlist id ${err.message}`);
    }
};

// sort playlist base on playlist name and creator name
const getPlaylistFilter = async function (parent, {
    playlist_input
}) {
    try {
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
                    localField: 'collaborator_ids',
                    foreignField: '_id',
                    as: 'user_data'
                }
            },
            {
                $match: {
                    'playlist_name': {
                        $regex: regPlaylistName,
                    },
                    // 'song_data.name': {
                    //     regSongName
                    // }
                    // // ,
                    // // 'user_data.name': {
                    // //     regCreatorName
                    // // }
                }
            }
        ]);
        console.log(result);
        return result;
    } catch (err) {
        throw new Error(`Error sorting playlist ${err.message}`);
    }
};

// get sorted data base on playlist name and creator name
const getPlaylistSort = async function (parent, {
    playlist_input
}) {
    try {
        // destruct playlist input
        const {
            playlist_name,
            creator_name
        } = playlist_input;

        // convert input into asc or desc mongo
        // convert playlist name
        const sortPlaylistName = playlist_name === 'asc' ? 1 : -1;

        // convert creator name
        const sortCreatorName = creator_name === 'asc' ? 1 : -1;

        // console.log(sortPlaylistName, sortCreatorName);

        // lookup data to get creator name
        // sort data with playlist name and creator name
        const result = await PlaylistModel.aggregate([{
                $lookup: {
                    from: 'songlists',
                    localField: 'song_ids',
                    foreignField: '_id',
                    as: 'song_data'
                }
            },
            {
                $sort: {
                    playlist_name: sortPlaylistName
                }
            }
        ]);

        console.log(result);
    } catch (err) {
        throw new Error(`Error getting sort playlist : ${err.message}`);
    }
};

// loaders
const getSonglistDataLoader = async function (parent, args, context) {
    if (parent.created_by) {
        // console.log(await context);
        return await context.load(parent.created_by);

        // return context.SongListLoader.
    }
};

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

// define all resolvers
const resolvers = {
    Query: {
        getAllUsers,
        getAllUserFilter,
        getUserById,
        getUserSort,
        getAllSongs,
        getSongById,
        getSongFilter,
        getSongSort,
        getAllPlaylist,
        getPlaylistById,
        getPlaylistFilter,
        getPlaylistSort

    },
    Mutation: {
        insertUser,
        insertSongList,
        insertPlaylist,
        insertSong,
        insertCollaborator,
        deleteSongPlaylist,
        deleteCollaboratorPlaylist
    },
    SongLists: {
        created_by: getSonglistDataLoader
    },
    Playlists: {
        created_by: getPlaylistCreatedByLoader,
        song_id: getPlaylistSongLoader,
        collaborator_ids: getPlaylistCollaboratorLoader
    },


};


// use apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: function ({
        req
    }) {
        return {
            SongListLoader,
            PlaylistCreatedByLoader,
            PlaylistSongLoader,
            PlaylistCollaboratorLoader
        };
    }
});

server.start().then(res => {
    server.applyMiddleware({
        app
    });
    // run port 
    app.listen(port, () => {
        console.log(`App running in port ${port}`);
    });
});