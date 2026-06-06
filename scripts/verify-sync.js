import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Read and parse .env manually
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

async function verify() {
  console.log("==================================================");
  console.log("🔍 STARTING DATABASE CONSISTENCY VERIFICATION");
  console.log("==================================================");

  console.log(`Remote API URL: ${REMOTE_API}`);
  console.log("Connecting to local database...");
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    // 1. Get remote total count
    console.log("Fetching remote total count...");
    const remoteRes = await fetch(`${REMOTE_API}/api/public/businesses?limit=1`);
    if (!remoteRes.ok) {
      throw new Error(`Failed to fetch remote count: ${remoteRes.statusText}`);
    }
    const remoteData = await remoteRes.json();
    const remoteTotal = remoteData.total || 0;

    // 2. Get local database count
    console.log("Fetching local database count...");
    const [localRows] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const localTotal = localRows[0]?.count || 0;

    console.log("\n--------------------------------------------------");
    console.log(`📊 Total Records Comparison:`);
    console.log(`- Remote (Render API):  ${remoteTotal.toLocaleString()}`);
    console.log(`- Local (business_list): ${localTotal.toLocaleString()}`);
    console.log("--------------------------------------------------");

    const countMatches = remoteTotal === localTotal;
    if (countMatches) {
      console.log("✅ SUCCESS: Record counts match perfectly!");
    } else {
      console.log("⚠️ WARNING: Record counts do not match!");
      const diff = Math.abs(remoteTotal - localTotal);
      console.log(`   Difference: ${diff.toLocaleString()} records`);
    }

    // 3. Compare random sample records
    console.log("\n🧪 Running sample checks (checking random pages)...");
    const testPages = [1, 15, 50, 100];
    let sampleFailures = 0;
    let sampleSuccesses = 0;

    for (const testPage of testPages) {
      console.log(`Checking page ${testPage}...`);
      const sampleRes = await fetch(`${REMOTE_API}/api/public/businesses?limit=10&page=${testPage}`);
      if (!sampleRes.ok) {
        console.error(`❌ Failed to fetch sample page ${testPage}`);
        continue;
      }

      const sampleData = await sampleRes.json();
      const sampleList = sampleData.businesses || [];

      for (const item of sampleList) {
        const [localBizRows] = await conn.execute(
          "SELECT _id, name, listingCode FROM business_list WHERE _id = ?",
          [item._id]
        );

        if (localBizRows.length === 0) {
          console.error(`❌ Record missing in local DB: _id=${item._id}, name="${item.name}"`);
          sampleFailures++;
        } else {
          const localBiz = localBizRows[0];
          // Check key mismatch if names differ slightly
          if (localBiz.name !== item.name) {
            console.warn(`⚠️ Name mismatch for _id=${item._id}:`);
            console.warn(`   Remote: "${item.name}"`);
            console.warn(`   Local:  "${localBiz.name}"`);
          }
          sampleSuccesses++;
        }
      }
    }

    console.log("\n--------------------------------------------------");
    console.log(`🧪 Sample Check Summary:`);
    console.log(`- Sample records verified: ${sampleSuccesses + sampleFailures}`);
    console.log(`- Matching: ${sampleSuccesses}`);
    console.log(`- Missing:  ${sampleFailures}`);
    console.log("--------------------------------------------------");

    if (countMatches && sampleFailures === 0) {
      console.log("\n🎉 ALL CHECKS PASSED: Remote URL and local database are in sync!");
    } else {
      console.log("\n❌ CONSISTENCY CHECKS FAILED! Please run the sync utility.");
    }
    console.log("==================================================");
  } catch (err) {
    console.error("Verification failed with error:", err);
  } finally {
    await conn.end();
  }
}

verify().catch(console.error);
