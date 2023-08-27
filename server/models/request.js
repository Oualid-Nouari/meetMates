const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    msg: {
        type: String
    }
})

const requestModel = mongoose.model('request', requestSchema);

module.exports = requestModel;