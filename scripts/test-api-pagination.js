/**
 * Test API pagination to understand how it works
 */

const REMOTE_API = "https://vanigan-app-automation-5il0.onrender.com";

async function testPagination() {
  console.log("Testing API pagination...\n");

  for (let page = 1; page <= 3; page++) {
    const url = `${REMOTE_API}/api/public/businesses?limit=100&page=${page}`;
    console.log(`\nFetching page ${page}:`);
    console.log(`URL: ${url}`);
    
    const res = await fetch(url);
    const data = await res.json();
    
    console.log(`- businesses returned: ${data.businesses?.length || 0}`);
    console.log(`- total: ${data.total}`);
    console.log(`- page: ${data.page}`);
    console.log(`- limit: ${data.limit}`);
    
    if (data.businesses && data.businesses.length > 0) {
      console.log(`- first business: ${data.businesses[0].name}`);
      console.log(`- last business: ${data.businesses[data.businesses.length - 1].name}`);
    }
  }
}

testPagination().catch(console.error);
