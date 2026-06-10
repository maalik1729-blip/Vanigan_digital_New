const mysql = require("mysql2/promise");
require("dotenv").config();

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || "127.0.0.1",
      port:     Number(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "vanigan",
      charset:  "utf8mb4",
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

module.exports = { getPool };
