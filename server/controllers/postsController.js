const postModel = require("../models/post")
const userModel = require("../models/user")

const createPost = async (req, res) => {
    let { postText, postImage, postTime } = req.body
    const userId = req.userId;
    try {
        const post = await postModel.create({ postAuthor: userId, postText, postImage, postTime })
        res.status(200).json({ post });
    } catch (err) {
        res.json({ err });
    }
}


const getPostAuthor = async (req, res) => {
    let { id } = req.query
    try {
        const author = await userModel.findById(id)
        res.status(200).json({ author });
    } catch (err) {
        res.json({ err });
    }
}

const getAllPosts = async (req, res) => {
    try {
        let { author } = req.query;
        const authorPosts = await postModel.find({ postAuthor: author })
        res.status(200).json({ authorPosts });
    } catch (err) {
        res.json({ err });
    }
}

const getPost = async (req, res) => {
    const { postid } = req.query;
    try {
        const post = await postModel.findById(postid);
        res.status(200).json({ post });
    } catch (err) {
        res.json({ err });
    }
}

const updatePost = async (req, res) => {
    const { postid } = req.query;
    const { postText, postImage } = req.body;
    try {
        const post = await postModel.findByIdAndUpdate(postid, { postText, postImage }, { new: true })
        res.status(200).json({ post });
    } catch (err) {
        res.json({ err });
    }
}

const deletePost = async (req, res) => {
    const { postid } = req.query;
    try {
        const post = await postModel.findByIdAndDelete(postid);
        res.status(200).json({ post });
    } catch (err) {
        console.log(err);
    }
}

const getExplorePosts = async (req, res) => {
    const { limit, skip } = req.query;
    const userId = req.userId;
    try {
        const posts = await postModel.find({ postAuthor: { $nin: [userId] } }).sort({ _id: -1 }).skip(Number(skip)).limit(Number(limit))
        res.status(200).json({ posts })
    } catch (err) {
        res.json({ err });
    }
}

const getPostsCount = async (req, res) => {
    const { author } = req.query;
    try {
        const postsCount = await postModel.find({ postAuthor: author }).count()
        res.status(200).json({ postsCount })
    } catch (err) {
        res.json({ err })
    }
}

module.exports = { createPost, getPostAuthor, getAllPosts, getPost, updatePost, deletePost, getExplorePosts, getPostsCount }