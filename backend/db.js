const mysql = require("mysql2/promise");
require("dotenv").config();

let pool = null;

function cleanObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && val.includes("cloudinary.com")) {
      obj[key] = cleanCloudinaryUrl(val);
    } else if (val && typeof val === "object") {
      cleanObject(val);
    }
  }
  return obj;
}

function cleanCloudinaryUrl(urlStr) {
  if (!urlStr || typeof urlStr !== "string") return urlStr;
  if (!urlStr.includes("cloudinary.com")) return urlStr;
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
      return `/uploads/misc/${filename}`;
    }

    let subParts = parts.slice(uploadIndex + 1);
    if (subParts.length > 0 && /^v\d+$/.test(subParts[0])) {
      subParts = subParts.slice(1);
    }

    return `/uploads/${subParts.join("/")}`;
  } catch (error) {
    return urlStr;
  }
}

function wrapPool(originalPool) {
  const originalExecute = originalPool.execute;
  originalPool.execute = async function(...args) {
    const result = await originalExecute.apply(originalPool, args);
    if (result && Array.isArray(result[0])) {
      result[0].forEach(row => cleanObject(row));
    }
    return result;
  };
  
  const originalQuery = originalPool.query;
  originalPool.query = async function(...args) {
    const result = await originalQuery.apply(originalPool, args);
    if (result && Array.isArray(result[0])) {
      result[0].forEach(row => cleanObject(row));
    }
    return result;
  };
  return originalPool;
}

function getPool() {
  if (!pool) {
    const rawPool = mysql.createPool({
      host:     process.env.DB_HOST     || "127.0.0.1",
      port:     Number(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "vanigan",
      charset:  "utf8mb4",
      waitForConnections: true,
      connectionLimit: 10,
      ssl: process.env.DB_HOST !== "127.0.0.1" ? { rejectUnauthorized: false } : undefined,
    });
    pool = wrapPool(rawPool);
  }
  return pool;
}

module.exports = { getPool };

