/**
 * Display records from business_list table
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

async function showRecords() {
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    // Get total count
    const [countRows] = await conn.execute("SELECT COUNT(*) as count FROM business_list");
    const total = countRows[0].count;

    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║           BUSINESS_LIST TABLE RECORDS                      ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log();
    console.log(`📊 Total Records: ${total.toLocaleString()}\n`);

    // Show first 20 records
    console.log("📋 First 20 Records:");
    console.log("━".repeat(120));
    
    const [records] = await conn.execute(`
      SELECT id, _id, name, category, subCategory, district, phone, listingCode
      FROM business_list 
      ORDER BY id 
      LIMIT 20
    `);

    records.forEach((rec, idx) => {
      console.log(`\n${idx + 1}. ID: ${rec.id}`);
      console.log(`   MongoDB ID: ${rec._id}`);
      console.log(`   Name: ${rec.name}`);
      console.log(`   Category: ${rec.category || 'N/A'}`);
      console.log(`   SubCategory: ${rec.subCategory || 'N/A'}`);
      console.log(`   District: ${rec.district || 'N/A'}`);
      console.log(`   Phone: ${rec.phone || 'N/A'}`);
      console.log(`   Listing Code: ${rec.listingCode || 'N/A'}`);
    });

    console.log("\n━".repeat(120));

    // Show category breakdown
    console.log("\n📊 Category Breakdown:");
    console.log("━".repeat(60));
    
    const [categories] = await conn.execute(`
      SELECT category, COUNT(*) as count 
      FROM business_list 
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 10
    `);

    categories.forEach((cat, idx) => {
      console.log(`${(idx + 1).toString().padStart(2)}. ${cat.category.padEnd(40)} : ${cat.count.toLocaleString().padStart(6)} businesses`);
    });

    // Show district breakdown
    console.log("\n📍 Top Districts:");
    console.log("━".repeat(60));
    
    const [districts] = await conn.execute(`
      SELECT district, COUNT(*) as count 
      FROM business_list 
      WHERE district IS NOT NULL AND district != ''
      GROUP BY district 
      ORDER BY count DESC 
      LIMIT 10
    `);

    districts.forEach((dist, idx) => {
      console.log(`${(idx + 1).toString().padStart(2)}. ${dist.district.padEnd(40)} : ${dist.count.toLocaleString().padStart(6)} businesses`);
    });

    // Show some statistics
    console.log("\n📈 Statistics:");
    console.log("━".repeat(60));
    
    const [stats] = await conn.execute(`
      SELECT 
        COUNT(DISTINCT category) as categories,
        COUNT(DISTINCT subCategory) as subCategories,
        COUNT(DISTINCT district) as districts,
        COUNT(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 END) as withPhone,
        COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as withEmail,
        COUNT(CASE WHEN website IS NOT NULL AND website != '' THEN 1 END) as withWebsite,
        COUNT(CASE WHEN image IS NOT NULL AND image != '' THEN 1 END) as withImages
      FROM business_list
    `);

    const s = stats[0];
    console.log(`   Unique Categories:    ${s.categories.toLocaleString()}`);
    console.log(`   Unique SubCategories: ${s.subCategories.toLocaleString()}`);
    console.log(`   Unique Districts:     ${s.districts.toLocaleString()}`);
    console.log(`   With Phone Number:    ${s.withPhone.toLocaleString()} (${(s.withPhone/total*100).toFixed(1)}%)`);
    console.log(`   With Email:           ${s.withEmail.toLocaleString()} (${(s.withEmail/total*100).toFixed(1)}%)`);
    console.log(`   With Website:         ${s.withWebsite.toLocaleString()} (${(s.withWebsite/total*100).toFixed(1)}%)`);
    console.log(`   With Images:          ${s.withImages.toLocaleString()} (${(s.withImages/total*100).toFixed(1)}%)`);

    console.log("\n" + "━".repeat(60));
    console.log("\n💡 To see more records, you can:");
    console.log("   - Open MySQL: mysql -u root vanigan");
    console.log("   - Query: SELECT * FROM business_list LIMIT 100;");
    console.log("   - Or modify this script to show different data");
    console.log();

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await conn.end();
  }
}

showRecords().catch(console.error);
