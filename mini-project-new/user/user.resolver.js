// import user model
const UserModel = require('./user.model');

// import bcrypt
const bcrypt = require('bcrypt');

// login user to get token (id)
const loginUser = async function (parent, {
    user_input
}) {
    try {
        // destruct user input
        const {
            email,
            password
        } = user_input;
        // console.log(email, password);

        // check if email is in database or not
        const checkEmail = await UserModel.find({
            email: email
        });
        if (Object.keys(checkEmail).length === 0) {
            throw new Error('Email is not in database');
        } else {

            // check password
            const hashed_password = checkEmail[0].hashed_password;
            const checkPassword = await bcrypt.compare(password, hashed_password);

            // make id to string
            const token = checkEmail[0]._id.toString();
            // console.log(token);
            if (checkPassword) {
                return {
                    email: email,
                    token: token
                };
            } else {
                throw new Error(`Wrong Password`);
            }
        }
        // return checkEmail;

    } catch (err) {
        throw new Error(`Error login : ${err.message}`);
    };
};


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
const editUser = async function (parent, {
    user_input
}) {
    try {
        // destruct user input
        const {
            ID,
            name,
            user_type,
            password
        } = user_input;
        console.log(ID, name, user_type, password);

        // define salt to hash password
        const salt = await bcrypt.genSalt(10);
        // generate salt to hash password
        const newPassword = await bcrypt.hash(password, salt);

        // search data base on token
        const result = await UserModel.findByIdAndUpdate(ID, {
            name: name,
            user_type: user_type,
            password: newPassword
        }, {
            new: true
        });
        return result;
    } catch (err) {
        throw new Error(`Error edit user : ${err.message}`);
    }
};


// ======================= Query =======================
// get all user data
const getAllUsers = async function (parent, {
    user_input
}) {
    try {
        // destruct user input
        const {
            limit,
            skip
        } = user_input;

        const result = await UserModel.aggregate([{
                $skip: skip * limit
            },
            {
                $limit: limit
            }
        ]);
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

module.exports = {
    Query: {
        getAllUsers,
        getAllUserFilter,
        getUserById,
        getUserSort,
    },
    Mutation: {
        loginUser,
        insertUser,
        editUser,
    }
}