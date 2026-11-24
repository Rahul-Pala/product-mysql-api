const db = require("../db");

// Find a user using their email
const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

// Create a new user in MySQL
const createUser = async (email, passwordHash) => {
  const [result] = await db.execute(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)",
    [email, passwordHash]
  );

  return result.insertId;
};


const findUserById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, email, role, created_at FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
};



module.exports = {
  findUserByEmail,
  createUser,
  findUserById
};
