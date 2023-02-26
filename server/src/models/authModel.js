const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Must provide first name'],
    },
    lastname: {
        type: String,
        required: [true, 'Must provide last name']
    },
    username: {
        type: String,
        minLength: [1, "username must be not be empty"],
        maxLength: [50, "username must not be greater than 50 letters"],
        required: [true, 'Must provide a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Must provide email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Auth', authSchema)