const mongoose = require('mongoose');


const notesSchema  = new mongoose.Schema({
        title : String,
        content: String,
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
     

})


const notesModel = mongoose.model("notes", notesSchema);

module.exports = notesModel;