const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Your name is required !']
    },
    username: {
        type: String,
        required: [true, 'Username is required !']
    },
    bio: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is Required !'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required !'],
        minlength: [7, 'Password should be at least 7 characters long']
    },
    profileImage: {
        type: String,
    },
    bannerImage: {
        type: String,
    }
})

userSchema.statics.signup = async function (fullName, username, email, password) {
    if (!fullName || !username || !email || !password) {
        throw Error('All fields are required !')
    }
    if (!validator.isEmail(email)) {
        throw Error('Please enter a valid email !')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough: use uppercase letters numbers and symbols...")
    }
    let exists = await this.findOne({ email })
    if (exists) {
        throw Error('Email already used')
    }
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ fullName, username, email, password: hash });
    return user;
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields are required !')
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email !')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password !')
    }
    return user;
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel