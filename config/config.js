const mongoose = require('mongoose');



async function connectDB () {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/DoNotesDB");
        console.log("mongodb connected successfully");
    }catch(error){
        console.error("mongodb connection failed: ", error.message);
        throw error;
    }
}
module.exports = connectDB

