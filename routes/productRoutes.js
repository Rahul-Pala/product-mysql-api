const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("/", productController.getProducts);
router.post("/", productController.addProduct);
router.delete("/:id", productController.removeProduct);
router.put("/:id", productController.editProduct);

module.exports = router;
