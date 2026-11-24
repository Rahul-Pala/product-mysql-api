const db = require("../db");

//GET - getAllproducts
const getAllProducts = async (limit = 10, offset = 0) => {
  const [rows] = await db.execute(
    "SELECT * FROM products ORDER BY id LIMIT ? OFFSET ?",
    [limit, offset]
  );

  return rows;
};

//POST - createProduct
const createProduct = async (name, price, stock) => {
  const [result] = await db.execute(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    [name, price, stock]
  );

  return result.insertId;
};

//PUT - updateProduct
const updateProduct = async (id, name, price, stock) => {
  const [result] = await db.execute(
    "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?",
    [name, price, stock, id]
  );

  return result.affectedRows;
};

//DELETE - deleteProduct
const deleteProduct = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};

module.exports = { getAllProducts, createProduct, updateProduct,deleteProduct};
