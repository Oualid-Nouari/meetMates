const requestModel = require('../models/request');
const userModel = require('../models/user');

const addRequest = async (req, res) => {
    const { receiverId, msg } = req.body;
    const userId = req.userId;
    try {
        const request = await requestModel.create({ senderId: userId, receiverId, msg })
        res.status(200).json({ request })
    } catch (err) {
        res.json({ err })
    }
}

const grapRequestSender = async (req, res) => {
    const { senderId } = req.query;
    try {
        const requestSender = await userModel.findById(senderId)
        res.status(200).json({ requestSender });
    } catch (err) {
        res.json({ err });
    }
}

const receivedRequests = async (req, res) => {
    const userId = req.userId;
    try {
        const userRequests = await requestModel.find({ receiverId: userId })
        res.status(200).json({ userRequests })
    } catch (err) {
        res.json({ err });
    }
}

const requestsMade = async (req, res) => {
    const userId = req.userId;
    try {
        const requestsMade = await requestModel.find({ senderId: userId })
        res.status(200).json({ requestsMade })
    } catch (err) {
        res.json({ err });
    }
}

const deleteRequest = async (req, res) => {
    const { receiverId } = req.query;
    const userId = req.userId;
    try {
        const deletedReq = await requestModel.findOneAndDelete({ receiverId, senderId: userId })
        res.status(200).json({ deletedReq })
    } catch (err) {
        res.json({ err });
    }
}

const rejectRequest = async (req, res) => {
    const { senderId, receiverId } = req.query;
    try {
        const deletedRequest = await requestModel.findOneAndDelete({ senderId, receiverId });
        res.status(200).json({ deletedRequest });
    } catch (err) {
        res.json({ err });
    }
}


module.exports = { addRequest, grapRequestSender, receivedRequests, requestsMade, deleteRequest, rejectRequest };