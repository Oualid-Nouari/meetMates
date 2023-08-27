const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    itemLiked: {
        type: String, 
        required: true
    },
    likedPostId: {
        type: String,
    },
    commentLikedId: {
        type: String,
    }
})

const likeModel = mongoose.model('like', likeSchema)

module.exports = likeModel;