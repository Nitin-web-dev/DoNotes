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
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "todos"
        }
    ],
    
    notes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "notes"
        }
    ]


})


const usersModel = mongoose.model("user", userSchema);

module.exports = usersModel