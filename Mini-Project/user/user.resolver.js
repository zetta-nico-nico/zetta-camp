// import user model
const UserModel = require('./user.model');

// ======================= Mutation =======================
// insert data into database
const insertUser = async function (parent, userInput) {
    try {
        // destruct userInput
        const {
            name
        } = userInput;
        console.log(name);
    } catch (err) {
        throw new Error('Error insert user : ${err.message}');
    };
};


// ======================= Query =======================
// get all user data
const getAllUser = async function (parent) {
    try {
        // get all data using find method
        const result = await UserModel.find();
        return result;
    } catch (err) {
        throw new Error('Error getAllUser : ${err.message}');
    };
};

module.exports = {
    Query: {
        getAllUser
    },
    Mutation: {
        insertUser
    }
}