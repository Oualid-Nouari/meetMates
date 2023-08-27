const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true,
    },
    user2: {
        type: String,
        required: true
    }
})

const friendshipModel = mongoose.model('friendship', friendshipSchema)

module.exports = friendshipModel;