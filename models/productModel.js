const db = require("../db");

//GET - getAllproducts
const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products");
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


const updateProduct = async (id, name, price, stock) => {
  const [result] = await db.execute(
    "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?",
    [name, price, stock, id]
  );

  return result.affectedRows;
};


const deleteProduct = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};




module.exports = { getAllProducts, createProduct, updateProduct,deleteProduct};
