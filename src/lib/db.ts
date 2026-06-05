import mysql from "mysql2/promise";

export const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    // Dynamically set max_allowed_packet size to 64MB in local development if privileges allow
    pool.query("SET GLOBAL max_allowed_packet = 67108864;").catch((err: any) => {
      console.warn("Could not set GLOBAL max_allowed_packet dynamically:", err.message);
    });
  }
  return pool;
}
