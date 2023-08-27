const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    msgTime: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'delivered'
    }
})

const messageModel = mongoose.model('message', messageSchema)

module.exports = messageModel;