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
`;