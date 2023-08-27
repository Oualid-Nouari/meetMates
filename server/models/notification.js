const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    }, 
    receiverId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    postId: {
        type: String,
    }
})

const notifModel = mongoose.model('notification', notificationSchema)

module.exports = notifModel;