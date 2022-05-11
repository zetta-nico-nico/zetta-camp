// import apollo server
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const typeDefs = gql `
type Users{
    id: ID
    name: String
    email: String
    hashed_password: String
    user_type: user_type_enum
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

input UserEditInput{
    name: String
    password: String
    user_type: user_type_enum
}

input UserSearchInput{
    user_id: ID
}

input Pagination{
    skip: Int
    limit: Int
}

input UserFilterInput{
    name: String,
    user_type: user_type_enum
}

input UserSortingInput{
    name: SortingList!
}

type LoginUser{
    email: String
    token: String
}
input LoginUserInput{
    email: String!
    password: String!
}

extend type Mutation{
    loginUser(user_input: LoginUserInput): LoginUser
    insertUser(user_input: UserInput) : Users
    editUser(user_input: UserEditInput): Users
}

extend type Query{
    getAllUsers(user_input: Pagination): [Users]
    getAllUserFilter(user_input: UserFilterInput): [Users]
    getUserById(user_input: UserSearchInput) : Users
    getUserSort(user_input: UserSortingInput): [Users] 
}
`;

module.exports = typeDefs;