const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
    content: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    completed: {
    type: Boolean,
    default: false
  }

})


const todoModel = mongoose.model("todos",todoSchema);

module.exports = todoModel;