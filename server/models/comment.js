const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    commentTime: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    targetedPost: {
        type: String,
        required: true
    }
})

const commentModel = mongoose.model('comment', commentSchema)

module.exports = commentModel;