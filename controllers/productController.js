
const productModel = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);

    res.status(500).json({
      error: "Unable to retrieve products"
    });
  }
};

const addProduct = async (req, res) => {
  try {
const { name, price, stock } = req.body;

    const id = await productModel.createProduct(
      name.trim(),
      price,
      stock
    );

    res.status(201).json({
      message: "Product added successfully",
      id: id
    });
  } catch (error) {
    console.error("Error adding product:", error.message);

    res.status(500).json({
      error: "Unable to add product"
    });
  }
};


const editProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price, stock } = req.body;

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        error: "Enter a valid product ID, name, price and stock"
      });
    }

    const affectedRows = await productModel.updateProduct(
      id,
      name.trim(),
      price,
      stock
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json({
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error("Error updating product:", error.message);

    res.status(500).json({
      error: "Unable to update product"
    });
  }
};


const removeProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Invalid product ID"
      });
    }

    const affectedRows = await productModel.deleteProduct(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);

    res.status(500).json({
      error: "Unable to delete product"
    });
  }
};


module.exports = {
  getProducts, addProduct, editProduct, removeProduct
};

// curl -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"test@example.com","password":"Hello123!"}'



  // curl -i -X POST http://localhost:3000/products \
  // -H "Content-Type: application/json" \
  // -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc5NTMyMDg3MywiZXhwIjoxNzk1MzI0NDczfQ.6Zb_Fu-T3ClnkX2VL4mNd88MKiVF5zsq2Y2iraxsFX8" \
  // -d '{"name":"Table","price":700,"stock":190}'