const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');

const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const found = await Auth.findOne({ $or: [{ email }, { username }] });

    if (found && found.length !== 0) {
        throw new Error("User already exists !");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({ firstname, lastname, username, email, password: hashedPassword.toString() })

    if (!user) {
        throw new Error("Something went wrong ! Please try again !")
    }

    res.status(200).json({ message: "User register successfully !", success: true });
});

const loginUser = asyncHandler(async (req, res) => {
    const { credential, password } = req.body;
    const user = await Auth.findOne({ $or: [{ email: credential }, { username: credential }] });
    if (!user) {
        throw new Error("User does not exists !");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error("Incorrect password !");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.status(200).json({
        user_id: user._id,
        username: user.username,
        email: user.email,
        token,
        success: true
    })
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await Auth.find({});

    if (!users) {
        throw new Error("Something went wrong ! Please try again !")
    }

    const userData = users.map((user) => {
        const { _id, firstname, lastname, username, email } = user;
        return { _id, firstname, lastname, username, email }
    })

    res.status(200).json({
        count: users.length,
        users: userData,
        success: true
    })
});

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
}