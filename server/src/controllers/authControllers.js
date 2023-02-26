const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');

const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const found = await Auth.findOne({ $or: [{ email }, { username }] })
    if (found && found.length !== 0) {
        throw new Error("User already exists !");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({ firstname, lastname, username, email, password: hashedPassword.toString() })

    if (!user) {
        throw new Error("Something went wrong ! Please try again !")
    }

    res.status(200).json({message: "User register successfully !"});
});

const loginUser = asyncHandler(async (req, res) => {
    const {credential,password} = req.body;
    const user = await Auth.findOne({
        $or : [{email:credential},{username: credential}]
    });
console.log(user);
    if(!user) {
        throw new Error("User does not exists !");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error("Incorrect password !");
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn : "3d"});

    res.status(200).json({
        user_id: user._id,
        username: user.username,
        email: user.email,
        token,
    })
});

module.exports = {
    registerUser,
    loginUser
}