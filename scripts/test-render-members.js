async function test() {
  const urls = [
    'https://vanigan-app-automation-5il0.onrender.com/api/public/members',
    'https://vanigan-app-automation-5il0.onrender.com/api/members',
    'https://vanigan-app-automation-5il0.onrender.com/api/public/members?epic=UDV1547645',
    'https://vanigan.digital/api/public/members',
    'https://vanigan.digital/api/public/members?epic=UDV1547645'
  ];

  for (const url of urls) {
    console.log(`Testing URL: ${url}`);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`Response snippet (first 300 chars): ${text.substring(0, 300)}`);
      } else {
        const errText = await res.text();
        console.log(`Error Response: ${errText.substring(0, 150)}`);
      }
    } catch (e) {
      console.error(`Fetch failed for ${url}:`, e.message);
    }
    console.log('-'.repeat(50));
  }
}

test().catch(console.error);
