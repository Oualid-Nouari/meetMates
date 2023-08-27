const express = require('express');
const postRouter = express.Router()
const { createPost, getPostAuthor, getAllPosts, getPost, updatePost, deletePost, getExplorePosts, getPostsCount } = require('../controllers/postsController');
const authMiddleware = require('../middleware/authMiddleware');


postRouter.post('/post', authMiddleware, createPost);
postRouter.get('/author', getPostAuthor);
postRouter.get('/posts', getAllPosts)
postRouter.get('/post', getPost)
postRouter.patch('/post', updatePost);
postRouter.delete('/post', deletePost)
postRouter.get('/explorePosts', authMiddleware, getExplorePosts)
postRouter.get('/postsCount', getPostsCount)

module.exports = {postRouter}