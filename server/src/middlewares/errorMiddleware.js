const errorMiddleware = (err, req, res, next) => {
    res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
    next();
}

module.exports = errorMiddleware;