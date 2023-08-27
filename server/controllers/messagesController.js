const messageModel = require('../models/Message');

const addNewMessage = async (req, res) => {
    const { receiverId, msgTime, msg } = req.body
    const userId = req.userId
    try {
        const message = await messageModel.create({ senderId: userId, receiverId, msgTime, msg })
        res.status(200).json({ message })
    } catch (err) {
        res.json({ err })
    }
}

const getMessages = async (req, res) => {
    const { receiverId } = req.query;
    const userId = req.userId
    try {
        const messages = await messageModel.find({ $or: [{ senderId: userId, receiverId }, { senderId: receiverId, receiverId: userId }] })
        res.status(200).json({ messages })
    } catch (err) {
        res.json({ err })
    }
}

const changeMessageStatus = async (req, res) => {
    const { messageId } = req.query;
    try {
        const editedMessage = await messageModel.findByIdAndUpdate(messageId, { status: 'seen' }, { new: true })
        res.status(200).json({ editedMessage })
    } catch (err) {
        res.json({ err })
    }
}

const getDeliveredMessages = async (req, res) => {
    let userId = req.userId;
    try {
        const deliveredMessages = await messageModel.find({ status: 'delivered', receiverId: userId })
        res.status(200).json({ deliveredMessages });
    } catch (err) {
        res.json({ err })
    }
}

module.exports = { addNewMessage, getMessages, changeMessageStatus, getDeliveredMessages }