
const validateProduct = (req, res, next) => {
  const { name, price, stock } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Enter a valid product name"
    });
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      message: "Enter a valid product price"
    });
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      message: "Enter a valid product stock"
    });
  }

  next();
};

module.exports = validateProduct;
