/**
 * Sync ALL records from remote API including duplicates
 * Handles duplicate listingCode by modifying them
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
  updated: 0,
  duplicatesFixed: 0,
  errors: 0,
  total: 0
};

/**
 * Insert or update a batch of businesses - handles duplicate listingCode
 */
async function upsertBatch(conn, list) {
  if (!list || list.length === 0) return;

  for (const b of list) {
    try {
      // Check if record exists by _id
      const [existing] = await conn.execute(
        "SELECT id, _id, name FROM business_list WHERE _id = ?",
        [b._id]
      );

      let listingCode = b.listingCode;
      
      // If this is a new insert and listingCode already exists, modify it
      if (existing.length === 0 && listingCode) {
        const [codeCheck] = await conn.execute(
          "SELECT id FROM business_list WHERE listingCode = ?",
          [listingCode]
        );
        
        if (codeCheck.length > 0) {
          // listingCode exists, create a unique one
          const timestamp = Date.now();
          listingCode = `${listingCode}_${timestamp}`;
          stats.duplicatesFixed++;
          console.log(`\n   🔧 Fixed duplicate listingCode: ${b.listingCode} → ${listingCode}`);
        }
      }

      const values = [
        b._id || null,
        b.name || "",
        listingCode || null,
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
      ];

      if (existing.length > 0) {
        // Update existing record
        const updateQuery = `
          UPDATE business_list SET
            name = ?, listingCode = ?, description = ?, category = ?, subCategory = ?,
            phone = ?, phone2 = ?, email = ?, website = ?, rating = ?,
            city = ?, district = ?, assembly = ?, address = ?, pincode = ?,
            landmark = ?, lat = ?, lng = ?,
            coverImage = ?, img = ?, image = ?, imageUrl = ?, imagePublicId = ?,
            openDays = ?, openTime = ?, closeTime = ?
          WHERE _id = ?
        `;
        await conn.execute(updateQuery, [...values.slice(1), b._id]);
        stats.updated++;
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO business_list (
            _id, name, listingCode, description, category, subCategory,
            phone, phone2, email, website, rating, city, district,
            assembly, address, pincode, landmark, lat, lng,
            coverImage, img, image, imageUrl, imagePublicId,
            openDays, openTime, closeTime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await conn.execute(insertQuery, values);
        stats.inserted++;
      }
    } catch (err) {
      console.error(`\n   ❌ Error processing record ${b._id} (${b.name}):`, err.message);
      stats.errors++;
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
  console.log("║         COMPLETE SYNC - ALL RECORDS INCLUDING DUPES       ║");
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

    console.log("🔄 SYNC MODE: Updates existing, inserts new (handles duplicates)");
    console.log();

    // Start syncing
    console.log("🚀 Starting sync process...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    let page = 1;
    stats.total = remoteTotal;
    const batchSize = 100;

    while (true) {
      const progress = ((stats.inserted + stats.updated + stats.errors) / stats.total * 100).toFixed(1);
      process.stdout.write(`\r📄 Page ${page}/${Math.ceil(stats.total / 60)} | Progress: ${progress}% | ✅ ${stats.inserted} new | 🔄 ${stats.updated} updated | 🔧 ${stats.duplicatesFixed} dupes fixed | ⚠️ ${stats.errors} errors`);

      const res = await fetch(`${REMOTE_API}/api/public/businesses?limit=${batchSize}&page=${page}`);
      if (!res.ok) {
        console.error(`\n❌ Failed to fetch page ${page}: ${res.statusText}`);
        break;
      }

      const data = await res.json();
      const list = data.businesses || [];
      
      if (list.length === 0) {
        console.log("\n✅ No more records to fetch");
        break;
      }

      await upsertBatch(conn, list);

      // Calculate current total processed
      const processed = stats.inserted + stats.updated + stats.errors;
      
      // Check if we've synced all records from the API
      if (processed >= stats.total) {
        console.log("\n✅ All records processed!");
        break;
      }

      page++;

      // Small delay to avoid overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 100));
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
    console.log(`   ✅ New records inserted:     ${stats.inserted.toLocaleString()}`);
    console.log(`   🔄 Existing records updated: ${stats.updated.toLocaleString()}`);
    console.log(`   🔧 Duplicate codes fixed:    ${stats.duplicatesFixed.toLocaleString()}`);
    console.log(`   ⚠️  Errors encountered:       ${stats.errors.toLocaleString()}`);
    console.log();
    console.log("📈 Database Status:");
    console.log(`   🗄️  Total records in DB:      ${finalCount.toLocaleString()}`);
    console.log(`   📡 Total on remote API:      ${remoteTotal.toLocaleString()}`);
    
    if (finalCount === remoteTotal) {
      console.log(`   ✅ PERFECT MATCH! All ${remoteTotal.toLocaleString()} records synced!`);
    } else {
      const diff = remoteTotal - finalCount;
      console.log(`   ⚠️  Difference: ${diff} records`);
    }
    console.log();

    if (stats.errors > 0) {
      console.log("⚠️  Some errors occurred. Please review the error messages above.");
    } else {
      console.log("🎉 All records synced successfully!");
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
