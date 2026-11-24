const express = require("express");
const router = express.Router();

// Import controller and middleware
const validateProduct = require("../middleware/validateProduct");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

// GET - View all products (public)
router.get("/", productController.getProducts);

// POST - Add a product (admin only)

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validateProduct,
  productController.addProduct
);


// DELETE - Remove a product (admin only)
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  productController.removeProduct
);

// PUT - Update a product (admin only)
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  productController.editProduct
);

module.exports = router;

// curl -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"test@example.com","password":"Hello123!"}'

