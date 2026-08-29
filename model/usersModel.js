const mongoose = require('mongoose');



const userSchema =  new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail : {
          type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    hashedPassword: {
        type: String,
        required: true
    }

})


const usersModel = mongoose.model("user", userSchema);

module.exports = usersModel