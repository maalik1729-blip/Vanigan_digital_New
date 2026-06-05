import mysql from "mysql2/promise";

const API = "https://vanigan-app-automation-5il0.onrender.com";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "vanigan",
};

async function sync() {
  console.log("Connecting to local MySQL database...");
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const [countRows] = await conn.execute("SELECT COUNT(*) as count FROM businesses");
    const count = countRows[0]?.count || 0;
    let page = Math.max(1, Math.floor(count / 60) - 2);
    let totalSynced = 0;
    console.log(`Current DB records: ${count}. Starting sync from page ${page}...`);

    while (true) {
      console.log(`Fetching page ${page}...`);
      const res = await fetch(`${API}/api/public/businesses?limit=100&page=${page}`);
      if (!res.ok) {
        console.error(`Failed to fetch page ${page}: ${res.statusText}`);
        break;
      }

      const data = await res.json();
      const list = data.businesses || [];
      if (list.length === 0) {
        console.log("No more businesses returned. Sync complete!");
        break;
      }

      console.log(`Processing ${list.length} businesses from page ${page}...`);

      for (const b of list) {
        const query = `
          INSERT INTO businesses (
            _id, name, listingCode, description, category, subCategory,
            phone, phone2, email, website, rating, city, district,
            assembly, address, pincode, landmark, lat, lng,
            coverImage, img, image, imageUrl, imagePublicId,
            openDays, openTime, closeTime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            listingCode = VALUES(listingCode),
            description = VALUES(description),
            category = VALUES(category),
            subCategory = VALUES(subCategory),
            phone = VALUES(phone),
            phone2 = VALUES(phone2),
            email = VALUES(email),
            website = VALUES(website),
            rating = VALUES(rating),
            city = VALUES(city),
            district = VALUES(district),
            assembly = VALUES(assembly),
            address = VALUES(address),
            pincode = VALUES(pincode),
            landmark = VALUES(landmark),
            lat = VALUES(lat),
            lng = VALUES(lng),
            coverImage = VALUES(coverImage),
            img = VALUES(img),
            image = VALUES(image),
            imageUrl = VALUES(imageUrl),
            imagePublicId = VALUES(imagePublicId),
            openDays = VALUES(openDays),
            openTime = VALUES(openTime),
            closeTime = VALUES(closeTime)
        `;

        const params = [
          b._id || null,
          b.name || "",
          b.listingCode || null,
          b.description || "",
          b.category || "",
          b.subCategory || "",
          b.phone || "",
          b.phone2 || "",
          b.email || "",
          b.website || "",
          b.avgRating || 0,
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
          b.closeTime || "",
        ];

        await conn.execute(query, params);
        totalSynced++;
      }

      if (list.length < 60) {
        console.log("Reached last page of businesses.");
        break;
      }

      page++;
      // Wait 300ms to avoid overwhelming the server and local database
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log(`\n🎉 Success! Synchronized total of ${totalSynced} business records to local MySQL 'vanigan.businesses' table.`);
  } catch (err) {
    console.error("Sync error:", err);
  } finally {
    await conn.end();
  }
}

sync().catch(console.error);
