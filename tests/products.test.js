const request = require("supertest");


jest.mock("../middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.userId = 1;
    next();
  };
});

jest.mock("../middleware/roleMiddleware", () => {
  return () => (req, res, next) => {
    next();
  };
});


// Replace the real MySQL model with fake functions
jest.mock("../models/productModel", () => ({
  getAllProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn()
}));

const productModel = require("../models/productModel");
const app = require("../app");

// Clear previous mock calls before each test
beforeEach(() => {
  jest.clearAllMocks();
});


// TEST 1: GET ALL PRODUCTS
describe("GET /products", () => {
  test("should return all products", async () => {

    const fakeProducts = [
      { id: 1, name: "Laptop", price: "1200.00", stock: 10 },
      { id: 2, name: "Phone", price: "800.00", stock: 25 }
    ];

    productModel.getAllProducts.mockResolvedValue(fakeProducts);

    const response = await request(app)
      .get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeProducts);

  });
});


// TEST 2: CREATE A PRODUCT
describe("POST /products", () => {
  test("should create a new product", async () => {

    const newProduct = {
      name: "Mouse",
      price: 49.99,
      stock: 20
    };

    productModel.createProduct.mockResolvedValue(6);

    const response = await request(app)
      .post("/products")
      .send(newProduct);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "Product added successfully",
      id: 6
    });

    expect(productModel.createProduct)
      .toHaveBeenCalledWith("Mouse", 49.99, 20);

  });
});


// TEST 3: UPDATE A PRODUCT
describe("PUT /products/:id", () => {
  test("should update an existing product", async () => {

    const updatedProduct = {
      name: "Mouse",
      price: 39.99,
      stock: 15
    };

    productModel.updateProduct.mockResolvedValue(1);

    const response = await request(app)
      .put("/products/5")
      .send(updatedProduct);

    expect(response.status).toBe(200);

    expect(productModel.updateProduct)
      .toHaveBeenCalledWith(5, "Mouse", 39.99, 15);

  });
});


// TEST 4: DELETE A PRODUCT
describe("DELETE /products/:id", () => {
  test("should delete an existing product", async () => {

    productModel.deleteProduct.mockResolvedValue(1);

    const response = await request(app)
      .delete("/products/5");

    expect(response.status).toBe(200);

    expect(productModel.deleteProduct)
      .toHaveBeenCalledWith(5);

  });
});


// TEST 5: REJECT INVALID PRODUCT PRICE
describe("POST /products - Error Handling", () => {
  test("should reject a negative price", async () => {

    const invalidProduct = {
      name: "Mouse",
      price: -50,
      stock: 10
    };

    const response = await request(app)
      .post("/products")
      .send(invalidProduct);

    expect(response.status).toBe(400);

    expect(productModel.createProduct)
      .not.toHaveBeenCalled();

  });
});


describe("PUT /products/:id - Not Found", () => {
  test("should return 404 if product does not exist", async () => {

    const updatedProduct = {
      name: "Mouse",
      price: 39.99,
      stock: 15
    };

    // Pretend MySQL updated zero rows
    productModel.updateProduct.mockResolvedValue(0);

    const response = await request(app)
      .put("/products/999")
      .send(updatedProduct);

    expect(response.status).toBe(404);

    expect(productModel.updateProduct)
      .toHaveBeenCalledWith(999, "Mouse", 39.99, 15);

  });
});


describe("DELETE /products/:id - Not Found", () => {
  test("should return 404 if product does not exist", async () => {

    // Pretend MySQL deleted zero rows
    productModel.deleteProduct.mockResolvedValue(0);

    const response = await request(app)
      .delete("/products/999");

    expect(response.status).toBe(404);

    expect(productModel.deleteProduct)
      .toHaveBeenCalledWith(999);

  });
});


describe("POST /products - Validation", () => {

  test("should reject an empty product name", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "   ",
        price: 500,
        stock: 10
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Enter a valid product name");
    expect(productModel.createProduct).not.toHaveBeenCalled();
  });

  test("should reject a negative price", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Laptop",
        price: -500,
        stock: 10
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Enter a valid product price");
    expect(productModel.createProduct).not.toHaveBeenCalled();
  });

  test("should reject decimal stock", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Laptop",
        price: 500,
        stock: 10.5
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Enter a valid product stock");
    expect(productModel.createProduct).not.toHaveBeenCalled();
  });

});

