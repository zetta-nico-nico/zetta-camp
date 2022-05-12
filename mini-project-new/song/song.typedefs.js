// import apollo server express
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

// define typedef
const typeDefs = gql `
type SongLists{
    _id: ID
    name: String
    genre: String,
    duration: Int,
    created_by: Users
}

type SongId{
    song_id: Users
}

extend enum SortingList{
    asc
    desc
}

extend input Pagination{
    skip: Int
    limit: Int
}

input SongListInput{
    name: String
    genre: String
    duration: Int
}

input SongListEditInput{
    song_id: ID
    name: String
}

input SongListDeleteInput{
    song_id: ID
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

extend type Mutation{
    insertSongList(songlist_input: SongListInput) : SongLists
    updateSong(songlist_input: SongListEditInput) : SongLists
    deleteSong(songlist_input: SongListDeleteInput): SongLists
}

extend type Query{
    getAllSongs(songlist_input: Pagination): [SongLists]
    getSongById(songlist_input: SearchSongInput): SongLists
    getSongFilter(songlist_input: SongListFilterInput): [SongLists]
    getSongSort(songlist_input: SongListSortInput): [SongLists]
}
`;

// export typedefs
module.exports = typeDefs;