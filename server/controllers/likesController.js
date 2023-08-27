const likeModel = require('../models/like');

const addLike = async (req, res) => {
    const { receiverId, itemLiked, likedPostId } = req.body;
    let userId = req.userId;
    try {
        const likedPost = await likeModel.create({ senderId: userId, receiverId, itemLiked, likedPostId })
        res.status(200).json({ likedPost });
    } catch (err) {
        res.json({ err })
    }
}

const getLikedPosts = async (req, res) => {
    let userId = req.userId
    try {
        const likedPosts = await likeModel.find({ senderId: userId, itemLiked: "post" })
        res.status(200).json({ likedPosts })
    } catch (err) {
        res.json({ err })
    }
}

const removeLike = async (req, res) => {
    const { itemLiked, likedPostId } = req.query;
    let userId = req.userId
    try {
        const removedLike = await likeModel.findOneAndDelete({ senderId: userId, itemLiked, likedPostId })
        res.status(200).json({ removedLike })
    } catch (err) {
        res.json({ err })
    }
}

module.exports = { addLike, getLikedPosts, removeLike }