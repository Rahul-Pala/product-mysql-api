const db = require("../db");

//GET - getAllproducts
const getAllProducts = async (
  limit = 10,
  offset = 0,
  search = "",
  minPrice = null,
  maxPrice = null,
  sortBy = "id",
  order = "asc",
  categoryId = null
) => {

  const allowedSortFields = ["id", "name", "price", "stock"];
  const allowedOrders = ["asc", "desc"];

  if (
    !allowedSortFields.includes(sortBy) ||
    !allowedOrders.includes(order)
  ) {
    throw new Error("Invalid sorting options");
  }

  let sql = `
  SELECT p.*, c.name AS category_name
  FROM products AS p
  LEFT JOIN categories AS c
  ON p.category_id = c.id
  WHERE p.name LIKE ?
`;
  const params = [`%${search}%`];

  if (minPrice !== null) {
    sql += " AND p.price >= ?";
    params.push(minPrice);
  }

  if (maxPrice !== null) {
    sql += " AND price <= ?";
    params.push(maxPrice);
  }

  if (categoryId !== null) {
  sql += " AND p.category_id = ?";
  params.push(categoryId);
}

  sql += ` ORDER BY p.${sortBy} ${order}`;

  if (sortBy !== "id") {
    sql += ", id ASC";
  }

  sql += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows] = await db.execute(sql, params);

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
