const productModel = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search ?? "";

    const sortBy = req.query.sortBy ?? "id";
    const order = req.query.order ?? "asc";

    const categoryId = req.query.categoryId !== undefined
  ? Number(req.query.categoryId)
  : null;

    const allowedSortFields = ["id", "name", "price", "stock"];
    const allowedOrders = ["asc", "desc"];

if (
  !allowedSortFields.includes(sortBy) ||
  !allowedOrders.includes(order)
) {
  return res.status(400).json({
    message: "Invalid sorting options"
  });
}

    const minPrice = req.query.minPrice !== undefined
  ? Number(req.query.minPrice)
  : null;

     const maxPrice = req.query.maxPrice !== undefined
  ? Number(req.query.maxPrice)
  : null;

  if (
  (minPrice !== null &&
    (!Number.isFinite(minPrice) || minPrice < 0)) ||
  (maxPrice !== null &&
    (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
  (minPrice !== null && maxPrice !== null &&
    minPrice > maxPrice)
) {
  return res.status(400).json({
    message: "Invalid price range"
  });
}

     if (typeof search !== "string" || search.length > 100) {
  return res.status(400).json({
    message: "Invalid search value"
  });
}

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message: "Invalid page or limit"
      });
    }

    const offset = (page - 1) * limit;

    if (!Number.isSafeInteger(offset)) {
      return res.status(400).json({
        message: "Invalid offset"
      });
    }

    if (
  categoryId !== null &&
  (!Number.isSafeInteger(categoryId) || categoryId <= 0)
) {
  return res.status(400).json({
    message: "Invalid category ID"
  });
}

    const products = await productModel.getAllProducts(
  limit,
  offset,
  search.trim(),
  minPrice,
  maxPrice,
  sortBy,
  order,
  categoryId
);

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
