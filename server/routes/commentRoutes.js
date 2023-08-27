const express = require('express');
const { addComment, getPostComments, getCommentAuthor } = require('../controllers/commentsController');
const authMiddleware = require('../middleware/authMiddleware');

const commentRouter = express.Router()

commentRouter.post('/comment', authMiddleware, addComment)
commentRouter.get('/comments', getPostComments)
commentRouter.get('/commentAuthor', getCommentAuthor)


module.exports = commentRouter;