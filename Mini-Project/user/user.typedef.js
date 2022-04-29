const {gql} = require('apollo-server-express');
const userTypeDef = gql`

    enum user_type_enum{
        Administrator
        Creator
        Enjoyer
    }
    type Users{
        name: String,
        email: String @unique
        hashed_password: String
        user_type: user_type_enum
    }

    input UserInput{
        name: String
        email: String
        password: String,
        user_type: user_type_enum
    }


    type Mutaton{
        insertUser(user_input: UserInput): Users
    }
`;

module.exports = userTypeDef;