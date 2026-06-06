/**
 * Find which records are in remote API but not in local DB
 */

import mysql from "mysql2/promise";

const REMOTE_API = "https://vanigan-app-automation-5il0.onrender.com";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

async function findMissing() {
  console.log("🔍 Finding missing records...\n");

  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    // Get all _id values from local database
    const [localRecords] = await conn.execute("SELECT _id FROM business_list");
    const localIds = new Set(localRecords.map(r => r._id));
    
    console.log(`📊 Local DB has ${localIds.size.toLocaleString()} unique _id values\n`);
    
    // Fetch all records from remote API
    console.log("📡 Fetching all records from remote API...");
    const remoteIds = new Map(); // Map to track duplicates
    const duplicateIds = new Set();
    let page = 1;
    let totalFetched = 0;
    
    while (true) {
      process.stdout.write(`\r   Fetching page ${page}...`);
      const res = await fetch(`${REMOTE_API}/api/public/businesses?limit=100&page=${page}`);
      const data = await res.json();
      const list = data.businesses || [];
      
      if (list.length === 0) break;
      
      list.forEach(b => {
        if (remoteIds.has(b._id)) {
          duplicateIds.add(b._id);
        }
        remoteIds.set(b._id, b.name);
        totalFetched++;
      });
      
      page++;
    }
    
    console.log(`\n   ✅ Fetched ${totalFetched.toLocaleString()} records`);
    console.log(`   📊 Unique _id values: ${remoteIds.size.toLocaleString()}\n`);
    
    if (duplicateIds.size > 0) {
      console.log(`⚠️  Found ${duplicateIds.size} duplicate _id values in remote API:`);
      duplicateIds.forEach(id => {
        console.log(`   - ${id}: ${remoteIds.get(id)}`);
      });
      console.log();
    }
    
    // Find missing IDs
    const missingIds = [];
    remoteIds.forEach((name, id) => {
      if (!localIds.has(id)) {
        missingIds.push({ _id: id, name });
      }
    });
    
    console.log("━".repeat(60));
    console.log("\n📈 Summary:");
    console.log(`   Remote API total records:  ${totalFetched.toLocaleString()}`);
    console.log(`   Remote API unique _ids:    ${remoteIds.size.toLocaleString()}`);
    console.log(`   Local DB records:          ${localIds.size.toLocaleString()}`);
    console.log(`   Duplicate _ids in remote:  ${duplicateIds.size}`);
    console.log(`   Missing from local:        ${missingIds.length}`);
    
    if (missingIds.length > 0) {
      console.log("\n⚠️  Missing records from local DB:");
      missingIds.forEach((rec, idx) => {
        console.log(`   ${idx + 1}. ${rec._id} - ${rec.name}`);
      });
    } else {
      console.log("\n✅ All unique records from remote API are in local DB!");
    }
    
    console.log("\n" + "━".repeat(60));
    console.log();
    
    // Calculate expected vs actual
    const expectedLocalCount = remoteIds.size;
    const actualLocalCount = localIds.size;
    
    if (expectedLocalCount === actualLocalCount) {
      console.log("🎉 PERFECT MATCH! Local DB has all unique records from remote API!");
    } else {
      console.log(`⚠️  Expected ${expectedLocalCount}, but have ${actualLocalCount}`);
      console.log(`   Difference: ${expectedLocalCount - actualLocalCount} records`);
    }
    console.log();
    
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await conn.end();
  }
}

findMissing().catch(console.error);
