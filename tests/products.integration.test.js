const request = require("supertest");
const app = require("../app");
const db = require("../db");

describe("Product API Integration Tests", () => {

  afterAll(async () => {
    await db.end();
  });

  test("GET /products returns products", async () => {

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

  });

  test("GET /products returns a saved product", async () => {

  const [result] = await db.execute(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    ["Test Phone", 800, 10]
  );

  const productId = result.insertId;

  try {
    const response = await request(app).get("/products");

    const product = response.body.find(
      item => item.id === productId
    );

    expect(response.status).toBe(200);
    expect(product).toBeDefined();
    expect(product.name).toBe("Test Phone");

  } finally {
    await db.execute(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );
  }

});

});
