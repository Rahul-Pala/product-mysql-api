const express = require("express");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();

app.use(express.json());

// Product routes
app.use("/products", productRoutes);

// Authentication routes
app.use("/auth", authRoutes);

// Temporary route to test error handling
app.get("/test-error", (req, res, next) => {
  const error = new Error("Testing error middleware");
  next(error);
});
// Handle errors from the routes above
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("My Express + MySQL API is working!");
});

module.exports = app;
