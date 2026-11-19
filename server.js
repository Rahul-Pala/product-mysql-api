const express = require("express");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("My Express + MySQL API is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
