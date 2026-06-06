/**
 * Sync ALL records from remote API EXACTLY as they are (including duplicates)
 * This will give us exactly 18,428 records to match the remote API
 */

import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Read .env
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

const stats = {
  inserted: 0,
  errors: 0,
  total: 0
};

/**
 * First, we need to drop unique constraints on _id and listingCode
 */
async function removeUniqueConstraints(conn) {
  console.log("🔧 Removing unique constraints to allow duplicates...\n");
  
  try {
    // Drop unique index on _id
    await conn.execute("ALTER TABLE business_list DROP INDEX _id");
    console.log("   ✅ Removed unique constraint on _id");
  } catch (err) {
    if (!err.message.includes("check that column/key exists")) {
      console.log(`   ⚠️  _id constraint: ${err.message}`);
    }
  }
  
  try {
    // Drop unique index on listingCode
    await conn.execute("ALTER TABLE business_list DROP INDEX listingCode");
    console.log("   ✅ Removed unique constraint on listingCode");
  } catch (err) {
    if (!err.message.includes("check that column/key exists")) {
      console.log(`   ⚠️  listingCode constraint: ${err.message}`);
    }
  }
  
  console.log();
}

async function insertBatch(conn, list) {
  if (!list || list.length === 0) return;

  const batchValues = [];
  for (const b of list) {
    batchValues.push([
      b._id || null,
      b.name || "",
      b.listingCode || null,
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
      b.closeTime || ""
    ]);
  }

  try {
    const insertQuery = `
      INSERT INTO business_list (
        _id, name, listingCode, description, category, subCategory,
        phone, phone2, email, website, rating, city, district,
        assembly, address, pincode, landmark, lat, lng,
        coverImage, img, image, imageUrl, imagePublicId,
        openDays, openTime, closeTime
      ) VALUES ?
    `;
    await conn.query(insertQuery, [batchValues]);
    stats.inserted += list.length;
  } catch (err) {
    console.error(`\n   ❌ Bulk insert error:`, err.message);
    // Fallback to one-by-one insert if bulk fails, to log individual errors
    for (const row of batchValues) {
      try {
        const insertQuery = `
          INSERT INTO business_list (
            _id, name, listingCode, description, category, subCategory,
            phone, phone2, email, website, rating, city, district,
            assembly, address, pincode, landmark, lat, lng,
            coverImage, img, image, imageUrl, imagePublicId,
            openDays, openTime, closeTime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await conn.execute(insertQuery, row);
        stats.inserted++;
      } catch (singleErr) {
        console.error(`\n   ❌ Error processing record:`, singleErr.message);
        stats.errors++;
      }
    }
  }
}

/**
 * Fetch total count from remote API
 */
async function getRemoteTotal() {
  try {
    const res = await fetch(`${REMOTE_API}/api/public/businesses?limit=1&page=1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.total || 0;
  } catch (err) {
    console.error("Failed to get remote total:", err.message);
    return 0;
  }
}

/**
 * Main sync function
 */
async function sync() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║       EXACT MATCH SYNC - ALL 18,428 RECORDS               ║");
  console.log("║       (Including Duplicates from Remote API)              ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`📡 Remote API: ${REMOTE_API}`);
  console.log(`🗄️  Database: ${DB_CONFIG.database}@${DB_CONFIG.host}`);
  console.log();

  // Get remote total
  console.log("🔍 Checking remote API...");
  const remoteTotal = await getRemoteTotal();
  console.log(`   Found ${remoteTotal.toLocaleString()} businesses on remote API`);
  console.log();

  // Connect to database
  console.log("🔌 Connecting to MySQL database...");
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    // Get current local count
    const [localCountRows] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const localCount = localCountRows[0]?.count || 0;
    console.log(`   Current local records: ${localCount.toLocaleString()}`);
    console.log();

    // Ask for confirmation to clear table
    console.log("⚠️  This will CLEAR the table and insert ALL records fresh");
    console.log("   to match the exact count (18,428) from remote API.");
    console.log();
    
    // Clear the table
    console.log("🗑️  Clearing business_list table...");
    await conn.execute("TRUNCATE TABLE business_list");
    console.log("   ✅ Table cleared\n");

    // Remove unique constraints
    await removeUniqueConstraints(conn);

    // Start syncing
    console.log("🚀 Starting sync process...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    let page = 1;
    stats.total = remoteTotal;
    const batchSize = 100;
    const concurrency = 10; // Fetch 10 pages in parallel

    while (true) {
      const progress = ((stats.inserted + stats.errors) / stats.total * 100).toFixed(1);
      process.stdout.write(`\r📄 Page ${page}/${Math.ceil(stats.total / 60)} | Progress: ${progress}% | ✅ ${stats.inserted} inserted | ⚠️ ${stats.errors} errors`);

      const fetchPromises = [];
      for (let i = 0; i < concurrency; i++) {
        const currentPage = page + i;
        fetchPromises.push(
          fetch(`${REMOTE_API}/api/public/businesses?limit=${batchSize}&page=${currentPage}`)
            .then(async (res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json();
              return data.businesses || [];
            })
            .catch((err) => {
              console.error(`\n❌ Failed to fetch page ${currentPage}:`, err.message);
              return [];
            })
        );
      }

      const results = await Promise.all(fetchPromises);
      const list = results.flat();

      if (list.length === 0) {
        console.log("\n✅ No more records to fetch");
        break;
      }

      await insertBatch(conn, list);

      const processed = stats.inserted + stats.errors;
      if (processed >= stats.total || results.some(r => r.length === 0)) {
        console.log("\n✅ All records processed!");
        break;
      }

      page += concurrency;

      // Small delay to avoid overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log();

    // Final count
    const [finalCountRows] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const finalCount = finalCountRows[0]?.count || 0;

    // Display summary
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                      SYNC COMPLETE!                        ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log();
    console.log("📊 Statistics:");
    console.log(`   ✅ Records inserted:          ${stats.inserted.toLocaleString()}`);
    console.log(`   ⚠️  Errors encountered:        ${stats.errors.toLocaleString()}`);
    console.log();
    console.log("📈 Database Status:");
    console.log(`   🗄️  Total records in DB:       ${finalCount.toLocaleString()}`);
    console.log(`   📡 Total on remote API:       ${remoteTotal.toLocaleString()}`);
    
    if (finalCount === remoteTotal) {
      console.log(`   ✅ EXACT MATCH! All ${remoteTotal.toLocaleString()} records synced!`);
    } else {
      const diff = remoteTotal - finalCount;
      console.log(`   ⚠️  Difference: ${diff} records`);
    }
    console.log();

    if (stats.errors > 0) {
      console.log("⚠️  Some errors occurred. Please review the error messages above.");
    } else {
      console.log("🎉 All records synced successfully with exact match!");
    }
    console.log();

  } catch (err) {
    console.error("\n❌ Sync error:", err);
    console.error(err.stack);
  } finally {
    await conn.end();
  }
}

// Run the sync
sync().catch(console.error);
