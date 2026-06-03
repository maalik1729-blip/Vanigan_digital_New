/**
 * Sangamam Portal — Voter Search API Server (Node.js)
 *
 * SETUP:
 *   1. Start XAMPP — ensure MySQL is running.
 *   2. Open phpMyAdmin → http://localhost/phpmyadmin
 *   3. Create database: voter_db
 *   4. Import: ass_25_Mylapore.sql
 *   5. In a terminal (separate from the Vite dev server):
 *        node voter-api-server.js
 *      Or:  npm run voter-api
 *   6. The React app calls http://localhost:3001/voter-search automatically.
 *
 * PORT: 3001  (change DB_CONFIG if your MySQL credentials differ)
 */

import http from "http";
import { createConnection } from "mysql2/promise";

const PORT = 3001;

const DB_CONFIG = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "voter_db",
  charset: "utf8mb4",
};

async function handleSearch(q, mode) {
  const conn = await createConnection(DB_CONFIG);
  try {
    let sql, params;
    switch (mode) {
      case "epic":
        sql    = "SELECT * FROM ass_25 WHERE EPIC_NO LIKE ? LIMIT 5";
        params = [`%${q}%`];
        break;
      case "mobile":
        sql    = "SELECT * FROM ass_25 WHERE MOBILE_NUMBER LIKE ? LIMIT 20";
        params = [`%${q}%`];
        break;
      case "part":
        sql    = "SELECT * FROM ass_25 WHERE PART_NO = ? OR SERIAL_NO = ? LIMIT 50";
        params = [q, q];
        break;
      default:
        sql    = "SELECT * FROM ass_25 WHERE VOTER_NAME LIKE ? LIMIT 30";
        params = [`%${q}%`];
    }
    const [rows] = await conn.execute(sql, params);
    return rows;
  } finally {
    await conn.end();
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname !== "/voter-search") {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const q    = url.searchParams.get("q")?.trim()    ?? "";
  const mode = url.searchParams.get("mode")?.trim() ?? "name";

  if (!q) {
    res.end("[]");
    return;
  }

  try {
    const rows = await handleSearch(q, mode);
    res.end(JSON.stringify(rows));
  } catch (err) {
    console.error("[voter-api] MySQL error:", err.message);
    res.writeHead(503);
    res.end(JSON.stringify({ error: "Database unavailable — is XAMPP MySQL running?" }));
  }
});

server.listen(PORT, () => {
  console.log(`\n  Voter Search API  →  http://localhost:${PORT}/voter-search`);
  console.log(`  MySQL             →  ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
