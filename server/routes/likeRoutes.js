const express = require('express');
const { addLike, getLikedPosts, removeLike } = require('../controllers/likesController');
const authMiddleware = require('../middleware/authMiddleware');

const likeRouter = express.Router();

likeRouter.post('/like', authMiddleware, addLike)
likeRouter.get('/postsLiked', authMiddleware, getLikedPosts)
likeRouter.delete('/like', authMiddleware, removeLike)

module.exports = likeRouter;