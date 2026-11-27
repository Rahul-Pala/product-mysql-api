const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        error: "Too many requests. Please try again later."
    },
    standardHeaders: "draft-7",
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        error: "Too many login attempts. Please try again later."
    },
    standardHeaders: "draft-7",
    legacyHeaders: false
});

module.exports = { globalLimiter, loginLimiter };