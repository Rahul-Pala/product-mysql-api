const errorMiddleware = (err, req, res, next) => {

    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({
            message: "Request body is too large"
        });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = errorMiddleware;