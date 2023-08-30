require('dotenv').config();
const userModel = require("../models/user")
const jwt = require('jsonwebtoken');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
}

const createUser = async (req, res) => {
    const { fullName, username, email, password } = req.body;
    try {
        const user = await userModel.signup(fullName, username, email, password);
        res.json({ user })
    } catch (error) {
        res.json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.login(email, password)
        const token = createToken(user._id);
        res.json({ token });
    } catch (error) {
        res.json({ error: error.message });
    }
}

const updateUser = async (req, res) => {
    let { fullName, username, bio, profileImage, bannerImage } = req.body
    const userId = req.userId
    try {
        const user = await userModel.findByIdAndUpdate(userId, { fullName, username, bio, profileImage, bannerImage }, { new: true, runValidators: true });
        res.status(200).json({ id: user._id, fullName: user.fullName, username: user.username, bio: user.bio, profileImage: user.profileImage, bannerImage: user.bannerImage });
    } catch (error) {
        res.json({error})
    }
}

const getConnectedUser = async (req, res) => {
    const userId = req.userId
    try {
        const user = await userModel.findById(userId)
        res.status(200).json({ id: user._id, fullName: user.fullName, username: user.username, bio: user.bio, profileImage: user.profileImage, bannerImage: user.bannerImage });
    } catch (err) {
        console.log(err)
    }
}

const getSuggestedUsers = async (req, res) => {
    const userId = req.userId
    try {
        const users = await userModel.find({ _id: { $nin: [userId] } })
        res.status(200).json(users);
    } catch (err) {
        console.log(err)
    }
}

const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const otherUser = await userModel.findById(id)
        res.status(200).json({ id: otherUser._id, fullName: otherUser.fullName, username: otherUser.username, bio: otherUser.bio, profileImage: otherUser.profileImage, bannerImage: otherUser.bannerImage })
    } catch (err) {
        res.json({ err });
    }
}

const suggestedUser = async (req, res) => {
    const { userId } = req.query;
    try {
        const suggestedUser = await userModel.findById(userId);
        res.status(200).json({ suggestedUser });
    } catch (err) {
        res.json({ err });
    }
}

const searchUsers = async (req, res) => {
    const { searchText } = req.query;
    const userId = req.userId;
    try {
        const searchedUsers = await userModel.find({
            _id: { $nin: [userId] },
            $or: [
                { username: { $regex: searchText, $options: 'i' } },
                { fullName: { $regex: searchText, $options: 'i' } }
            ]
        });
        res.json({ searchedUsers });
    } catch (err) {
        res.json({ err });
    }
};

module.exports = { createUser, loginUser, updateUser, getConnectedUser, getSuggestedUsers, getUser, suggestedUser, searchUsers }