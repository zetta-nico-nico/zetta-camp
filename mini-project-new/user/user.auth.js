// import model
const UserModel = require('./user.model');

// import jwt
const jwt = require('jsonwebtoken');

// ======================= Authorization =======================
// auth to add user
// must use token
// parameter name, email, password, user type
const userAuth = async function (resolver, parent, args, context) {
    try {
        // get token
        let token = context.req.get('Authorization');

        // check if token is not empty
        if (!token) {
            throw new Error('Token required');
        } else {
            // check if token is valid or not
            const decoded = jwt.verify(token, 'nico');
            // console.log(decoded);
        }

        return resolver();
    } catch (err) {
        throw new Error(`Error insert auth : ${err.message}`);
    }
};


// edit data auth
const editUserAuth = async function (resolver, parent, {
    user_input
}, context) {
    try {

        // get token
        let token = context.req.get('Authorization');
        // console.log(token);

        // check if token is empty
        if (!token) {
            throw new Error('Token required');
        } else {
            // check if token is valid or not
            const decoded = jwt.verify(token, 'nico');

            // search id from email in token
            // console.log(decoded.email);
            const userSearch = await UserModel.find({
                email: decoded.email
            });
            // console.log(userSearch);
            if (Object.keys(userSearch).length === 0) {
                throw new Error('Email is not in database');
            } else {
                // assign id into params
                user_input.ID = userSearch[0].id;
                // console.log(user_input);
            }
        };
        return resolver();

    } catch (err) {
        throw new Error(`Error edit data auth : ${err.message}`);
    }
};

// export auth
module.exports = {
    Query: {
        getAllUsers: userAuth,
        getAllSongs: userAuth,
        getSongById: userAuth,
        getPlaylistById: userAuth
    },
    Mutation: {
        insertUser: userAuth,
        editUser: editUserAuth,
    }
};