const db = require("../db");

const createOrder = async (productId, quantity) => {

  const connection = await db.getConnection();

  console.log("2. Database connection acquired");
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE id = ? FOR UPDATE",
      [productId]
    );

    const product = rows[0];

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const [result] = await connection.execute(
      `INSERT INTO orders (product_id, quantity, total_price)
       SELECT id, ?, price * ?
       FROM products WHERE id = ?`,
      [quantity, quantity, productId]
    );

    await connection.execute(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [quantity, productId]
    );

    await connection.commit();

    return result.insertId;

  } catch (error) {

    await connection.rollback();
    throw error;

  } finally {

    connection.release();

  }
};

module.exports = { createOrder };