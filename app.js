const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const { globalLimiter } = require("./middleware/rateLimitMiddleware");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "upgrade-insecure-requests": isProduction ? [] : null
        }
    }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || false
}));

app.use(globalLimiter);

app.use(express.json({
    limit: "10kb"
}));

// Swagger documentation
if (!isProduction) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Home route
app.get("/", (req, res) => {
    res.send("My Express + MySQL API is working!");
});

// API routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Centralised error handling
app.use(errorMiddleware);

module.exports = app;