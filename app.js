const express = require("express");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("My Express + MySQL API is working!");
});

module.exports = app;
