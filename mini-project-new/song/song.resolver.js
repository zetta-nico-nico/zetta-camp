// import song model
const SonglistsModel = require('./song.model');

// import user model
const UserModel = require('../user/user.model');

// ======================= Song List =======================
// ======================= Mutation =======================
const insertSongList = async function (parent, {
    songlist_input
}, context) {
    try {
        // check if there is an input or not
        if (!songlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct song list input
            const {
                name,
                genre,
                duration,
            } = songlist_input;

            // console.log(name, genre, duration, created_by);

            // store id from context
            const userId = context.user[0]._id;

            // store user type from context
            const userType = context.user[0].user_type;
            // console.log(userType);

            // check if user is administrator or not
            if (userType === 'Administrator') {
                // define new model to store input
                const newSong = new SonglistsModel({
                    name: name,
                    genre: genre,
                    duration: duration,
                    created_by: userId
                });
                const result = await newSong.save();
                return result;
            } else {
                throw new Error(`You are not Administrator.`);
            };
        };
    } catch (err) {
        throw new Error(`Error insertSongList : ${err.message}`);
    };
};

// update song
const updateSong = async function (parent, {
    songlist_input
}, context) {
    try {
        // check if there is an input or not
        if (!songlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct song input
            const {
                song_id,
                name
            } = songlist_input;
            // console.log(song_id, name);
            // console.log(context.user);

            // store id from context
            const userId = context.user[0]._id;
            // check if song created by user who login
            const checkUser = await SonglistsModel.find({
                _id: song_id,
                created_by: userId
            });
            // console.log(checkUser);

            // check if song is created by login user
            if (Object.keys(checkUser).length === 0) {
                throw new Error(`You are not the song creator`);
            } else {
                // search data using findbyid method
                const result = await SonglistsModel.findByIdAndUpdate(song_id, {
                    name: name
                }, {
                    new: true
                });
                return result;
            };
            // return result;

        }
    } catch (er) {
        throw new Error(`Error updateSong : ${er.message}`);
    };
};


// delete song
const deleteSong = async function (parent, {
    songlist_input
}, context) {
    try {
        // check if there is an input or not
        if (!songlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct song list input 
            const {
                song_id
            } = songlist_input;
            // console.log(song_id);

            // get user id from context
            const userId = context.user[0]._id;
            // console.log(userId);

            // check if song created by user login
            const checkUser = await SonglistsModel.find({
                _id: song_id,
                created_by: userId
            });
            // console.log(checkUser);

            // check if check user is empty or not
            if (Object.keys(checkUser).length === 0) {
                throw new Error(`You can' delete another user's song`);
            } else {
                // delete song
                const result = await SonglistsModel.findByIdAndRemove(song_id, {
                    new: false
                });
                return result;
            };
        }
    } catch (err) {
        throw new Error(`Error deleting song : ${err.message}`);
    }
};

// ======================= Query =======================
// get all song list data
const getAllSongs = async function (parent, {
    songlist_input
}) {
    try {
        // check if input is empty or not
        if (!songlist_input) {
            // get all book lists data using find method
            const songs = await SonglistsModel.find();
            const count = await SonglistsModel.count();

            return {
                songs,
                count
            };
        } else {

            // destruct song list input
            const {
                limit,
                page
            } = songlist_input;

            // get all book lists data using find method
            const songs = await SonglistsModel.aggregate([{
                $skip: page * limit
            }, {
                $limit: limit
            }]);
            const count = await SonglistsModel.count();

            return {
                songs,
                count
            };
        };

    } catch (err) {
        throw new Error(`Error getAllSongs : ${err.message}`);
    };
};

// get song list data base on song id
const getSongById = async function (parent, {
    songlist_input
}) {
    try {
        // check if there is an input or not
        if (!songlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct songlist_input
            const {
                song_id
            } = songlist_input;
            // get song using findbyid method
            const result = await SonglistsModel.findById(song_id);
            return result;
        }
    } catch (err) {
        throw new Error(`Error getSongById : ${err.message}`);
    };
};


// get all song with creator name
const getSongFilter = async function (parent, {
    songlist_input
}) {
    try {
        // check if there is an input or not
        if (!songlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct songlist input
            const {
                name,
                genre,
                creator_name,
                duration
            } = songlist_input;
            // console.log(songlist_input);

            // change all input into regex
            const regCreator = new RegExp(creator_name, 'i');
            const regGenre = new RegExp(genre, 'i');
            const regName = new RegExp(name, 'i');
            const regDuration = new RegExp(duration, 'i');
            // console.log(regDuration);

            // check if duration is null
            if (duration === null) {
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
                    },
                    {
                        $addFields: {
                            duration_string: {
                                $toString: '$duration'
                            }
                        }
                    },
                    {
                        $match: {
                            'name': {
                                $regex: regName
                            },
                            'song_data.name': {
                                $regex: regCreator
                            },
                            'genre': {
                                $regex: regGenre
                            }
                        }
                    }
                ]);
                // console.log(result);
                return result;
            } else {
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
                    },
                    {
                        $addFields: {
                            duration_string: {
                                $toString: '$duration'
                            }
                        }
                    },
                    {
                        $match: {
                            'name': {
                                $regex: regName
                            },
                            'song_data.name': {
                                $regex: regCreator
                            },
                            'genre': {
                                $regex: regGenre
                            },
                            'duration_string': {
                                $regex: regDuration
                            }
                        }
                    }
                ]);
                // console.log(result);
                return result;

            };
        };
    } catch (err) {
        throw new Error(`Error getSongFilter : ${err.message}`);
    };
};

// get song data sort
const getSongSort = async function (parent, {
    songlist_input
}) {
    try {
        // check if there is an input or not
        if (!songlist_input) {
            throw new Error('Please input data first');
        } else {
            // destruct songlist input
            const {
                name,
                genre,
                creator_name
            } = songlist_input;
            // console.log(name, genre, creator_name);

            // check if there is input name
            if (name) {
                // make ternary operator to define sort used
                // sort for name
                const sortName = name === 'asc' ? 1 : -1;

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
                        }
                    }
                ]);
                return result;
            }
            // check if there is input genre
            else
            if (genre) {
                // make ternary operator to define sort used
                // sort for name
                const sortGenre = genre === 'asc' ? 1 : -1;

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
                            genre: sortGenre
                        }
                    }
                ]);
                return result;
            }
            // check if there is input creator name
            else
            if (creator_name) {
                // make ternary operator to define sort used
                // sort for name
                const sortCreatorName = name === 'asc' ? 1 : -1;

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
                            'data.creator_name': sortCreatorName,
                        }
                    }
                ]);
                return result;
            }
            // if there is no input
            // output all
            else {
                const result = await SonglistsModel.aggregate([{
                    $lookup: {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'data'
                    }
                }]);
                return result;
            };
        };
    } catch (err) {
        throw new Error(`Error getSongSort : ${err.message}`);
    };
};


// loader song data
const getSonglistDataLoader = async function (parent, args, context) {
    if (parent.created_by) {
        // console.log(await context);
        // console.log(context.SongListLoader);
        return await context.SongListLoader.load(parent.created_by);

        // return context.SongListLoader.
    }
};

module.exports = {
    Query: {
        getAllSongs,
        getSongById,
        getSongFilter,
        getSongSort,
    },
    Mutation: {
        insertSongList,
        updateSong,
        deleteSong,
    },
    SongLists: {
        created_by: getSonglistDataLoader
    }
};