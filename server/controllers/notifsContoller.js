const notifModel = require("../models/notification");
const userModel = require("../models/user")

const createNewNotif = async (req, res) => {
    const { type, senderId, receiverId, postId } = req.query;
    try {
        if (postId) {
            const notification = await notifModel.create({ senderId, receiverId, type, postId })
            res.status(200).json({ notification })
        } else {
            const notification = await notifModel.create({ senderId, receiverId, type })
            res.status(200).json({ notification })
        }
    } catch (err) {
        res.json({ err });
    }
}

const receivedNotifications = async (req, res) => {
    let userId = req.userId
    try {
        const receivedNotifs = await notifModel.find({ receiverId: userId })
        res.status(200).json({ receivedNotifs });
    } catch (err) {
        res.json({ err })
    }
}

const getNotifSender = async (req, res) => {
    const { senderId } = req.query;
    try {
        const notifSender = await userModel.findById(senderId)
        res.status(200).json({ notifSender })
    } catch (err) {
        res.json({ err })
    }
}

const deleteNotifs = async (req, res) => {
    let userId = req.userId;
    try {
        const deletedNotifications = await notifModel.deleteMany({ receiverId: userId })
        res.status(200).json({ deletedNotifications });
    } catch (err) {
        res.json({ err })
    }
}

module.exports = { createNewNotif, receivedNotifications, getNotifSender, deleteNotifs }