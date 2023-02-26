const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const protect = asyncHandler(async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token,process.env.JWT_SECRET);
            req.user = data;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized !");
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("Not Authorized ! No Token found !")
    }
})

module.exports = protect;