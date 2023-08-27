const express = require('express')
const { createNewNotif, receivedNotifications, getNotifSender, deleteNotifs } = require('../controllers/notifsContoller')
const authMiddleware = require('../middleware/authMiddleware')

const notificationsRouter = express.Router()

notificationsRouter.post('/notification', createNewNotif)
notificationsRouter.get('/notifications', authMiddleware, receivedNotifications)
notificationsRouter.get('/notifSender', getNotifSender)
notificationsRouter.delete('/notifications', authMiddleware, deleteNotifs)

module.exports = notificationsRouter;