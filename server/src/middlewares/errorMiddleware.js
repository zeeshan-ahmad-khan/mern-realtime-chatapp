const errorMiddleware = (err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
    next();
}

module.exports = errorMiddleware;