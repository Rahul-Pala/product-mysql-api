const orderModel = require("../models/orderModel");

const addOrder = async (req, res) => {

    console.log("Order controller reached");
  try {
    const { productId, quantity } = req.body;

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Invalid product ID or quantity"
      });
    }

    const userId = req.userId;

    const orderId = await orderModel.createOrder(
    productId,
    quantity,
    userId
);

    res.status(201).json({
      message: "Order created successfully",
      orderId: orderId
    });

  } catch (error) {

    if (error.message === "Product not found") {
      return res.status(404).json({
        message: error.message
      });
    }

    if (error.message === "Insufficient stock") {
      return res.status(409).json({
        message: error.message
      });
    }

    console.error(error.message);

    res.status(500).json({
      message: "Unable to create order"
    });
  }
};

module.exports = { addOrder };