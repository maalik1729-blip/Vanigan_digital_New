/**
 * Quick database readiness check
 * Run this before syncing to ensure everything is set up correctly
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

async function checkDatabase() {
  console.log("🔍 Checking database readiness...\n");

  try {
    // Test connection
    console.log("1️⃣  Testing MySQL connection...");
    const conn = await mysql.createConnection(DB_CONFIG);
    console.log("   ✅ Connected to MySQL successfully\n");

    // Check database exists
    console.log("2️⃣  Checking database 'vanigan' exists...");
    const [databases] = await conn.execute("SHOW DATABASES LIKE 'vanigan'");
    if (databases.length === 0) {
      console.log("   ❌ Database 'vanigan' not found!");
      console.log("   Please create it: CREATE DATABASE vanigan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
      await conn.end();
      return;
    }
    console.log("   ✅ Database 'vanigan' exists\n");

    // Check table exists
    console.log("3️⃣  Checking 'business_list' table exists...");
    const [tables] = await conn.execute("SHOW TABLES LIKE 'business_list'");
    if (tables.length === 0) {
      console.log("   ❌ Table 'business_list' not found!");
      console.log("   Please run: mysql -u root vanigan < scripts/create-business-table.sql");
      await conn.end();
      return;
    }
    console.log("   ✅ Table 'business_list' exists\n");

    // Show table structure
    console.log("4️⃣  Checking table structure...");
    const [columns] = await conn.execute("DESCRIBE business_list");
    console.log(`   ✅ Table has ${columns.length} columns\n`);
    
    // Show key columns
    console.log("   Key columns:");
    const keyColumns = ['id', '_id', 'name', 'listingCode', 'category', 'subCategory'];
    columns.forEach(col => {
      if (keyColumns.includes(col.Field)) {
        console.log(`      - ${col.Field.padEnd(15)} (${col.Type}) ${col.Key ? '[' + col.Key + ']' : ''}`);
      }
    });
    console.log();

    // Show current record count
    console.log("5️⃣  Checking current data...");
    const [countRows] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const count = countRows[0].count;
    console.log(`   📊 Current records in database: ${count.toLocaleString()}\n`);

    // Show sample record
    if (count > 0) {
      const [sampleRows] = await conn.execute("SELECT _id, name, category, district FROM business_list LIMIT 1");
      console.log("   Sample record:");
      console.log(`      ID: ${sampleRows[0]._id}`);
      console.log(`      Name: ${sampleRows[0].name}`);
      console.log(`      Category: ${sampleRows[0].category}`);
      console.log(`      District: ${sampleRows[0].district}`);
      console.log();
    }

    // Check indexes
    console.log("6️⃣  Checking indexes...");
    const [indexes] = await conn.execute("SHOW INDEX FROM business_list");
    const uniqueIndexes = indexes.filter(idx => idx.Key_name !== 'PRIMARY');
    console.log(`   ✅ Found ${uniqueIndexes.length} indexes (excluding primary key)\n`);

    await conn.end();

    // Final summary
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║              DATABASE IS READY FOR SYNC!                  ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log();
    console.log("✅ All checks passed! You can now run:");
    console.log("   node scripts/sync-businesses-safe.js");
    console.log();

  } catch (err) {
    console.error("\n❌ Error:", err.message);
    console.error("\nPlease fix the issues above before syncing.\n");
    
    if (err.code === 'ECONNREFUSED') {
      console.log("💡 Tips:");
      console.log("   - Make sure MySQL server is running");
      console.log("   - Check the host and port in DB_CONFIG");
      console.log("   - Verify your MySQL credentials");
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("💡 Tips:");
      console.log("   - Check your MySQL username and password");
      console.log("   - Update DB_CONFIG in the script if needed");
    }
    console.log();
  }
}

checkDatabase().catch(console.error);
