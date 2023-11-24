const mongoose = require('mongoose')
const Type = mongoose.Schema.Types

const commentSchema = new mongoose.Schema({
    post: {
        type: Type.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: Type.ObjectId,
        ref: 'User',
        required: true
    },
    userInfo: {
        type: Type.ObjectId,
        ref: 'Auth',
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    }
}, {timestamps: true})



module.exports = mongoose.model("Comment", commentSchema)