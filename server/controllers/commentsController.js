const commentModel = require("../models/comment");
const userModel = require("../models/user")

const addComment = async (req, res) => {
    const { receiverId, commentText, commentTime, targetedPost } = req.body;
    let userId = req.userId
    try {
        const comment = await commentModel.create({ senderId: userId, receiverId, commentText, commentTime, targetedPost })
        res.status(200).json({ comment });
    } catch (err) {
        res.json({ err })
    }
}

const getPostComments = async (req, res) => {
    const { postId } = req.query;
    try {
        const comments = await commentModel.find({ targetedPost: postId })
        res.status(200).json({ comments })
    } catch (err) {
        res.json({ err })
    }
}

const getCommentAuthor = async (req, res) => {
    let { id } = req.query
    try {
        const author = await userModel.findById(id)
        res.status(200).json({ author });
    } catch (err) {
        res.json({ err });
    }
}

module.exports = { addComment, getPostComments, getCommentAuthor }