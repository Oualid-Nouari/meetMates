const express = require("express")
const userRouter = express.Router()
const { createUser, loginUser, updateUser, getConnectedUser, getSuggestedUsers, getUser, suggestedUser, searchUsers } = require('../controllers/usersController')
const authMiddleware = require("../middleware/authMiddleware")

userRouter.get('/user', authMiddleware, getConnectedUser)
userRouter.post('/user', createUser)
userRouter.post('/login', loginUser)
userRouter.patch('/user', authMiddleware, updateUser);
userRouter.get('/users', authMiddleware, getSuggestedUsers)
userRouter.get('/users/:id', getUser)
userRouter.get('/suggestedUser', suggestedUser);
userRouter.get('/searchUsers', authMiddleware, searchUsers)

module.exports = {userRouter}