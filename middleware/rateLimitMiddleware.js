const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { isIP } = require("node:net");

const getClientKey = (req) => {
    const railwayIP = req.get("X-Real-IP");

    if (
        process.env.NODE_ENV === "production" &&
        railwayIP &&
        isIP(railwayIP)
    ) {
        return ipKeyGenerator(railwayIP);
    }

    return ipKeyGenerator(req.ip);
};

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    keyGenerator: getClientKey,
    message: {
        error: "Too many requests. Please try again later."
    },
    standardHeaders: "draft-7",
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    keyGenerator: getClientKey,
    message: {
        error: "Too many login attempts. Please try again later."
    },
    standardHeaders: "draft-7",
    legacyHeaders: false
});

module.exports = { globalLimiter, loginLimiter };