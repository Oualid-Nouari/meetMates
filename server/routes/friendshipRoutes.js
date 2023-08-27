const express = require('express');
const { makeNewFriendship, getFriend, getFriendship, removeFriend, getAllFriends, getFriendDetails } = require('../controllers/friendshipsController');
const authMiddleware = require('../middleware/authMiddleware');
const friendshipRouter = express.Router();

friendshipRouter.post('/friendship', makeNewFriendship)
friendshipRouter.get('/friendship', authMiddleware, getFriendship)
friendshipRouter.get('/friends', getAllFriends)
friendshipRouter.delete('/friend', authMiddleware , removeFriend)
friendshipRouter.get('/friend', getFriendDetails)

module.exports = friendshipRouter;