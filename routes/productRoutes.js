const express = require("express");
const router = express.Router();

// Import controller and middleware
const validateProduct = require("../middleware/validateProduct");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

// GET - View all products (public)

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get("/", productController.getProducts);
router.get("/", productController.getProducts);
router.get("/", productController.getProducts);

// POST - Add a product (admin only)
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               price:
 *                 type: number
 *                 example: 1200
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product details
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
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

