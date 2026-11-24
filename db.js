
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

const isTestDb = process.env.NODE_ENV === "test-db";

// Load the correct environment file
dotenv.config({
  path: isTestDb ? ".env.test" : ".env",
  override: isTestDb,
  quiet: true
});

// Prevent database tests from using the wrong database
if (
  isTestDb &&
  process.env.DB_NAME !== "product_store_test"
) {
  throw new Error("Database tests must use product_store_test");
}

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Export the connection pool
module.exports = db;
