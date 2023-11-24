const mongoose = require('mongoose')
const Type = mongoose.Schema.Types



const userActivitySchema = new mongoose.Schema({
    user_id: {
        type: Type.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: Type.ObjectId,
        ref: 'post',
        required: true
    },
    action: {
        type: String,
        enum: ["like", "comment", "recommend"],
        required: true
    },
    timestamp: { type: Date, default: Date.now },
})





module.exports =  mongoose.model("UserActivity", userActivitySchema);
