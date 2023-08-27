require('dotenv').config();
const friendshipModel = require("../models/friendship");
const userModel = require("../models/user");
const jwt = require('jsonwebtoken');

const makeNewFriendship = async (req, res) => {
    const { userA, userB } = req.query;
    try {
        const user1 = await userModel.findById(userA)
        const user2 = await userModel.findById(userB)
        const newFriendship = await friendshipModel.create({ user1: user1._id, user2: user2._id })
        res.status(200).json({ newFriendship });
    } catch (err) {
        res.json({ err });
    }
}

const getFriendship = async (req, res) => {
    const { friendId } = req.query;
    const userId = req.userId
    try {
        const friend = await friendshipModel.findOne({ $or: [{ user1: friendId, user2: userId }, { user2: friendId, user1: userId }] })
        res.status(200).json({ friend })
    } catch (err) {
        res.json({ err })
    }
}



const removeFriend = async (req, res) => {
    const { friendId } = req.query;
    const userId = req.userId;
    try {
        const deletedFriendship = await friendshipModel.findOneAndDelete({ $or: [{ user1: userId, user2: friendId }, { user1: friendId, user2: userId }] })
        res.status(200).json({ deletedFriendship });
    } catch (err) {
        console.log(err)
    }
}

const getAllFriends = async (req, res) => {
    const access_header = req.headers.access_header;
    const { userId } = req.query;
    if (access_header) {
        const token = access_header.split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    console.log(err)
                } else {
                    const user_Id = decoded.id
                    try {
                        const friends = []
                        const friendsList = await friendshipModel.find({ $or: [{ user1: user_Id }, { user2: user_Id }] })
                        friendsList.map(friend => {
                            friend.user1 !== user_Id && friends.push(friend.user1);
                            friend.user2 !== user_Id && friends.push(friend.user2);
                        })
                        res.status(200).json({ friends });
                    } catch (err) {
                        console.log(err)
                    }
                }
            })
        }
    } else {
        try {
            const friends = []
            const friendsList = await friendshipModel.find({ $or: [{ user1: userId }, { user2: userId }] })
            friendsList.map(friend => {
                friend.user1 !== userId && friends.push(friend.user1);
                friend.user2 !== userId && friends.push(friend.user2);
            })
            res.status(200).json({ friends });
        } catch (err) {
            console.log(err)
        }
    }
}

const getFriendDetails = async (req, res) => {
    const { friendId } = req.query;
    try {
        const friend = await userModel.findById(friendId)
        res.status(200).json({ friend })
    } catch (err) {
        res.json({ err })
    }
}

module.exports = { makeNewFriendship, getFriendship, removeFriend, getFriendDetails, getAllFriends };