// import apollo server
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

// define schema
const typeDefs = gql `
type Playlists{
    _id: ID
    playlist_name: String
    song_id: [SongLists]
    created_by: Users
    collaborator_ids: [Users]
}

extend enum SortingList{
    asc
    desc
}

input PlaylistInput{
    playlist_name: String
    song_ids: [ID]
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
    playlist_name: SortingList
    creator_name: SortingList
}

extend type Mutation{
    insertPlaylist(playlist_input: PlaylistInput): Playlists
    insertSong(playlist_input: PlaylistSongInput): Playlists
    insertCollaborator(playlist_input: PlaylistCollaboratorInput) : Playlists
    deleteSongPlaylist(playlist_input: PlaylistSongInput): Playlists
    deleteCollaboratorPlaylist(playlist_input:PlaylistCollaboratorInput ): Playlists
}

extend type Query{
    getAllPlaylist: [Playlists]
    getPlaylistById(playlist_input: PlaylistIdInput): Playlists
    getPlaylistFilter(playlist_input: PlaylistFilterInput) : [Playlists]
    getPlaylistSort(playlist_input: PlaylistSortInput): [Playlists]
}
`;

// export gql
module.exports = typeDefs;