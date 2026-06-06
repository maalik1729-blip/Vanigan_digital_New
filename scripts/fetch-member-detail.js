async function run() {
  console.log("Step 1: Fetching login page to get CSRF token...");
  const response1 = await fetch('https://vanigan.digital/admin/dashboard', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html1 = await response1.text();
  const tokenMatch = html1.match(/name="_token"\s+value="([^"]+)"/);
  if (!tokenMatch) {
    console.error("Could not find CSRF token.");
    return;
  }
  const token = tokenMatch[1];

  const setCookieHeaders = response1.headers.getSetCookie();
  const cookies = setCookieHeaders.map(c => c.split(';')[0]).join('; ');

  console.log("Step 2: Submitting login credentials...");
  const body = new URLSearchParams();
  body.append('_token', token);
  body.append('username', 'admin');
  body.append('password', 'admin');

  const response2 = await fetch('https://vanigan.digital/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies,
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://vanigan.digital/admin/dashboard'
    },
    body: body.toString(),
    redirect: 'manual'
  });

  const setCookieHeaders2 = response2.headers.getSetCookie();
  const cookieMap = new Map();
  setCookieHeaders.concat(setCookieHeaders2).forEach(c => {
    const parts = c.split(';')[0].split('=');
    if (parts.length >= 2) {
      cookieMap.set(parts[0].trim(), parts.slice(1).join('=').trim());
    }
  });
  const mergedCookies = Array.from(cookieMap.entries()).map(([k, v]) => `${k}=${v}`).join('; ');

  console.log("Step 3: Fetching specific member detail page...");
  const response3 = await fetch('https://vanigan.digital/admin/users/TNVS-86720930', {
    headers: {
      'Cookie': mergedCookies,
      'User-Agent': 'Mozilla/5.0'
    }
  });

  console.log("Status code:", response3.status);
  const html3 = await response3.text();
  const fs = await import('fs');
  fs.writeFileSync('member_detail.html', html3);
  console.log("Saved member detail HTML to member_detail.html (Length:", html3.length, ")");
}

run().catch(console.error);
