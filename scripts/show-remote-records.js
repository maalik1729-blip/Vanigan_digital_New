/**
 * Display records from remote API
 */

const REMOTE_API = "https://vanigan-app-automation-5il0.onrender.com";

async function showRemoteRecords() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║           REMOTE API BUSINESS RECORDS                      ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`📡 API: ${REMOTE_API}/api/public/businesses`);
  console.log();

  try {
    // Get first page to see total
    console.log("🔍 Fetching data from remote API...\n");
    const firstPage = await fetch(`${REMOTE_API}/api/public/businesses?limit=60&page=1`);
    const firstData = await firstPage.json();
    
    const total = firstData.total || 0;
    console.log(`📊 Total Records on Remote API: ${total.toLocaleString()}`);
    console.log(`📄 Records Per Page: 60`);
    console.log(`📃 Total Pages: ${Math.ceil(total / 60)}`);
    console.log();

    // Show first 20 records
    console.log("📋 First 20 Records from Remote API:");
    console.log("━".repeat(120));
    
    const businesses = firstData.businesses || [];
    
    businesses.slice(0, 20).forEach((biz, idx) => {
      console.log(`\n${idx + 1}. MongoDB ID: ${biz._id}`);
      console.log(`   Name: ${biz.name}`);
      console.log(`   Listing Code: ${biz.listingCode || 'N/A'}`);
      console.log(`   Category: ${biz.category || 'N/A'}`);
      console.log(`   SubCategory: ${biz.subCategory || 'N/A'}`);
      console.log(`   District: ${biz.district || 'N/A'}`);
      console.log(`   Phone: ${biz.phone || 'N/A'}`);
      console.log(`   Active: ${biz.active}`);
      console.log(`   Created: ${biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : 'N/A'}`);
      console.log(`   Updated: ${biz.updatedAt ? new Date(biz.updatedAt).toLocaleDateString() : 'N/A'}`);
    });

    console.log("\n" + "━".repeat(120));

    // Fetch a few more pages to analyze data
    console.log("\n🔍 Analyzing remote API data...");
    
    const categories = new Map();
    const districts = new Map();
    const allIds = new Map();
    const duplicateIds = new Set();
    
    let pagesAnalyzed = 0;
    const maxPagesToAnalyze = 50; // Analyze first 50 pages (~3000 records)
    
    for (let page = 1; page <= maxPagesToAnalyze; page++) {
      process.stdout.write(`\r   Analyzing page ${page}/${maxPagesToAnalyze}...`);
      const res = await fetch(`${REMOTE_API}/api/public/businesses?limit=60&page=${page}`);
      const data = await res.json();
      const list = data.businesses || [];
      
      if (list.length === 0) break;
      
      list.forEach(b => {
        // Track categories
        if (b.category) {
          categories.set(b.category, (categories.get(b.category) || 0) + 1);
        }
        
        // Track districts
        if (b.district) {
          districts.set(b.district, (districts.get(b.district) || 0) + 1);
        }
        
        // Track duplicate IDs
        if (allIds.has(b._id)) {
          duplicateIds.add(b._id);
        }
        allIds.set(b._id, b.name);
      });
      
      pagesAnalyzed++;
    }
    
    console.log(`\n   ✅ Analyzed ${pagesAnalyzed} pages (${allIds.size} unique records)\n`);

    // Show top categories from sample
    console.log("📊 Top 10 Categories (from sample):");
    console.log("━".repeat(60));
    const sortedCategories = Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedCategories.forEach(([cat, count], idx) => {
      console.log(`${(idx + 1).toString().padStart(2)}. ${cat.padEnd(40)} : ${count.toString().padStart(4)} businesses`);
    });

    // Show top districts from sample
    console.log("\n📍 Top 10 Districts (from sample):");
    console.log("━".repeat(60));
    const sortedDistricts = Array.from(districts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedDistricts.forEach(([dist, count], idx) => {
      console.log(`${(idx + 1).toString().padStart(2)}. ${dist.padEnd(40)} : ${count.toString().padStart(4)} businesses`);
    });

    // Show duplicates if found
    if (duplicateIds.size > 0) {
      console.log("\n⚠️  Duplicate _id values found in sample:");
      console.log("━".repeat(60));
      let dupCount = 0;
      duplicateIds.forEach(id => {
        console.log(`   ${++dupCount}. ${id} - ${allIds.get(id)}`);
      });
    }

    console.log("\n" + "━".repeat(60));
    console.log("\n📝 API Response Format:");
    console.log("━".repeat(60));
    console.log(`   {
     "businesses": [ ...array of business objects... ],
     "total": ${total},
     "page": 1,
     "limit": 60
   }`);

    console.log("\n💡 To fetch all records:");
    console.log(`   - Endpoint: ${REMOTE_API}/api/public/businesses`);
    console.log(`   - Pagination: ?page=1&limit=60`);
    console.log(`   - Total pages: ${Math.ceil(total / 60)}`);
    console.log(`   - Use page numbers 1 to ${Math.ceil(total / 60)}`);
    console.log();

  } catch (err) {
    console.error("\n❌ Error fetching from remote API:", err.message);
  }
}

showRemoteRecords().catch(console.error);
