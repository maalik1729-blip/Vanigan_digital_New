import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Read and parse .env manually to avoid dotenv dependency issues
const dotenvPath = path.resolve(process.cwd(), ".env");
const env = {};
if (fs.existsSync(dotenvPath)) {
  const content = fs.readFileSync(dotenvPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[match[1]] = value;
    }
  });
}

const REMOTE_API = env.REMOTE_API_URL || "https://vanigan-app-automation-5il0.onrender.com";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

async function insertBatch(conn, list, seenIds, seenCodes) {
  if (!list || list.length === 0) return;

  const query = `
    INSERT INTO business_list (
      _id, name, listingCode, description, category, subCategory,
      phone, phone2, email, website, rating, city, district,
      assembly, address, pincode, landmark, lat, lng,
      coverImage, img, image, imageUrl, imagePublicId,
      openDays, openTime, closeTime
    ) VALUES ?
  `;

  const values = list.map((b) => {
    let finalId = b._id;
    let finalCode = b.listingCode;

    // Resolve duplicate _id
    if (finalId) {
      if (seenIds.has(finalId)) {
        finalId = `${finalId}_dup${seenIds.size}`;
      }
      seenIds.add(finalId);
    }

    // Resolve duplicate listingCode
    if (finalCode) {
      if (seenCodes.has(finalCode)) {
        finalCode = `${finalCode}-DUP${seenCodes.size}`;
      }
      seenCodes.add(finalCode);
    }

    return [
      finalId || null,
      b.name || "",
      finalCode || null,
      b.description || "",
      b.category || "",
      b.subCategory || "",
      b.phone || "",
      b.phone2 || "",
      b.email || "",
      b.website || "",
      b.avgRating || b.rating || 0,
      b.city || "",
      b.district || "",
      b.assembly || "",
      b.address || "",
      b.pincode || "",
      b.landmark || "",
      b.lat || "",
      b.lng || "",
      b.coverImage || "",
      b.img || "",
      b.image || "",
      b.imageUrl || "",
      b.imagePublicId || "",
      b.openDays || "",
      b.openTime || "",
      b.closeTime || "",
    ];
  });

  await conn.query(query, [values]);
}

async function sync() {
  console.log("--------------------------------------------------");
  console.log(`Syncing from remote: ${REMOTE_API}`);
  console.log("Connecting to local MySQL database...");
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const args = process.argv.slice(2);
    const isFullSync = args.includes("--full");

    if (isFullSync) {
      console.log("Truncating local 'business_list' table for a clean full sync...");
      await conn.execute("TRUNCATE TABLE business_list");
    }

    const seenIds = new Set();
    const seenCodes = new Set();

    // If not a full sync, load existing unique keys to avoid duplicate conflicts
    if (!isFullSync) {
      const [existingRows] = await conn.execute("SELECT _id, listingCode FROM business_list");
      existingRows.forEach(r => {
        if (r._id) seenIds.add(r._id);
        if (r.listingCode) seenCodes.add(r.listingCode);
      });
      console.log(`Loaded ${seenIds.size} existing IDs and ${seenCodes.size} listing codes.`);
    }

    let page = 1;
    let totalSynced = 0;
    const limit = 100;

    while (true) {
      console.log(`Fetching page ${page} (limit ${limit})...`);
      const res = await fetch(`${REMOTE_API}/api/public/businesses?limit=${limit}&page=${page}`);
      if (!res.ok) {
        console.error(`Failed to fetch page ${page}: ${res.statusText}`);
        break;
      }

      const data = await res.json();
      const list = data.businesses || [];
      if (list.length === 0) {
        console.log("No more business records returned.");
        break;
      }

      console.log(`Syncing ${list.length} records...`);
      await insertBatch(conn, list, seenIds, seenCodes);
      totalSynced += list.length;

      // If list is smaller than the requested limit, we are likely at the last page
      if (list.length < limit && !isFullSync) {
        console.log("Reached last page of businesses.");
        break;
      }

      page++;
      // Small delay to avoid overloading local MySQL
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const [finalCountRows] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const finalCount = finalCountRows[0]?.count || 0;
    console.log("--------------------------------------------------");
    console.log(`🎉 Success! Synchronized ${totalSynced} records.`);
    console.log(`Final DB count: ${finalCount}`);
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("Sync error:", err);
  } finally {
    await conn.end();
  }
}

sync().catch(console.error);
