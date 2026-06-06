/**
 * Clear all records from business_list table
 */

import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
  charset: "utf8mb4",
};

async function clearTable() {
  console.log("🗑️  Clearing business_list table...\n");

  try {
    const conn = await mysql.createConnection(DB_CONFIG);

    // Get current count
    const [countBefore] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const beforeCount = countBefore[0].count;
    
    console.log(`📊 Current records: ${beforeCount}`);
    
    if (beforeCount === 0) {
      console.log("✅ Table is already empty!\n");
      await conn.end();
      return;
    }

    console.log(`\n⚠️  About to delete ${beforeCount} records...`);
    
    // Delete all records
    await conn.execute("TRUNCATE TABLE business_list");
    
    // Verify deletion
    const [countAfter] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const afterCount = countAfter[0].count;
    
    console.log(`\n✅ Deleted ${beforeCount - afterCount} records`);
    console.log(`📊 Remaining records: ${afterCount}`);
    console.log("\n🎉 Table cleared successfully!\n");

    await conn.end();

  } catch (err) {
    console.error("\n❌ Error:", err.message);
  }
}

clearTable().catch(console.error);
