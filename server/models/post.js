const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postAuthor: {
        type: String,
        required: true,
    },
    postText: {
        type: String
    },
    postImage: {
        type: String,
    },
    postTime: {
        type: String,
        required: true,
    }
})

const postModel = mongoose.model('post', postSchema);

module.exports = postModel