
const db = require("../db");
const productModel = require("../models/productModel");

describe("Product Model Integration Tests", () => {

  afterAll(async () => {
    await db.end();
  });

  test("getAllProducts returns an array", async () => {

    const products = await productModel.getAllProducts();

    expect(Array.isArray(products)).toBe(true);

  });

  //Create a product and verify it was inserted correctly
test("createProduct inserts a product", async () => {

  const productId = await productModel.createProduct(
    "Test Laptop",
    1200,
    5
  );

  try {
    expect(productId).toBeGreaterThan(0);

    const [rows] = await db.execute(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Test Laptop");

  } finally {
    await db.execute(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );
  }

});
});
