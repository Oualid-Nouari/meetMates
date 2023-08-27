const express = require('express')
const { addNewMessage, getMessages, changeMessageStatus, getDeliveredMessages } = require('../controllers/messagesController')
const authMiddleware = require('../middleware/authMiddleware')

const messageRouter = express.Router()

messageRouter.post('/message', authMiddleware, addNewMessage)
messageRouter.get('/messages', authMiddleware, getMessages)
messageRouter.patch('/message', changeMessageStatus)
messageRouter.get('/deliveredMessages', authMiddleware, getDeliveredMessages)

module.exports = messageRouter