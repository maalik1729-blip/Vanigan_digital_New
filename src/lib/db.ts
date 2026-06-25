import mysql from "mysql2/promise";

export const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "vanigan",
  charset: "utf8mb4",
};

let pool: mysql.Pool | null = null;

function cleanObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && val.includes("cloudinary.com")) {
      obj[key] = cleanCloudinaryUrl(val);
    } else if (val && typeof val === "object") {
      cleanObject(val);
    }
  }
  return obj;
}

function cleanCloudinaryUrl(urlStr: string): string {
  if (!urlStr || typeof urlStr !== "string") return urlStr;
  if (!urlStr.includes("cloudinary.com")) return urlStr;
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
      return `/uploads/misc/${filename}`;
    }

    let subParts = parts.slice(uploadIndex + 1);
    if (subParts.length > 0 && /^v\d+$/.test(subParts[0])) {
      subParts = subParts.slice(1);
    }

    return `/uploads/${subParts.join("/")}`;
  } catch (error) {
    return urlStr;
  }
}

function wrapPool(originalPool: mysql.Pool): mysql.Pool {
  const originalExecute = originalPool.execute;
  originalPool.execute = async function(...args: any[]) {
    const result = await originalExecute.apply(originalPool, args as any);
    if (result && Array.isArray(result[0])) {
      (result[0] as any[]).forEach(row => cleanObject(row));
    }
    return result;
  } as any;
  
  const originalQuery = originalPool.query;
  originalPool.query = async function(...args: any[]) {
    const result = await originalQuery.apply(originalPool, args as any);
    if (result && Array.isArray(result[0])) {
      (result[0] as any[]).forEach(row => cleanObject(row));
    }
    return result;
  } as any;
  return originalPool;
}

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const rawPool = mysql.createPool(dbConfig);
    // Dynamically set max_allowed_packet size to 64MB in local development if privileges allow
    rawPool.query("SET GLOBAL max_allowed_packet = 67108864;").catch((err: any) => {
      if (import.meta.env.DEV) {
        console.warn("Could not set GLOBAL max_allowed_packet dynamically:", err.message);
      }
    });
    pool = wrapPool(rawPool);
  }
  return pool;
}


export async function upsertBusinesses(pool: mysql.Pool, list: any[]) {
  if (!list || list.length === 0) return;

  const query = `
    INSERT INTO business_list (
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

  // Fetch all existing duplicate suffixes and codes to generate new ones if needed
  const [existingIdsRows]: any = await pool.execute("SELECT _id, listingCode FROM business_list");
  const existingIds = new Set<string>(existingIdsRows.map((r: any) => r._id).filter(Boolean));
  const existingCodes = new Set<string>(existingIdsRows.map((r: any) => r.listingCode).filter(Boolean));

  for (const b of list) {
    let finalId = b._id;
    let finalCode = b.listingCode;

    if (finalId) {
      // 1. Try to match with existing database row
      // We look for any row that has this _id, or a prefixed version (like _id_dup1)
      const [matches]: any = await pool.execute(
        "SELECT _id, name, listingCode, phone FROM business_list WHERE _id = ? OR _id LIKE ?",
        [finalId, `${finalId}_dup%`]
      );

      if (matches.length > 0) {
        // Find the best match using name, listingCode or phone
        const bestMatch = matches.find((r: any) =>
          r.listingCode === b.listingCode ||
          r.name === b.name ||
          (r.phone && r.phone === b.phone)
        ) || matches[0];
        
        finalId = bestMatch._id;
        finalCode = bestMatch.listingCode;
      } else {
        // No matches found in DB. This is a new record/duplicate.
        // Resolve duplicate _id
        if (existingIds.has(finalId)) {
          let suffixNum = 1;
          while (existingIds.has(`${finalId}_dup${suffixNum}`)) {
            suffixNum++;
          }
          finalId = `${finalId}_dup${suffixNum}`;
        }
        existingIds.add(finalId);

        // Resolve duplicate listingCode
        if (finalCode && existingCodes.has(finalCode)) {
          let suffixNum = 1;
          while (existingCodes.has(`${finalCode}-DUP${suffixNum}`)) {
            suffixNum++;
          }
          finalCode = `${finalCode}-DUP${suffixNum}`;
        }
        if (finalCode) {
          existingCodes.add(finalCode);
        }
      }
    }

    const params = [
      finalId || null,
      b.name || "",
      finalCode || null,
      b.description || "",
      b.category || "",
      b.subCategory || "",
      b.phone || "",
      b.phone2 || "",
      b.email || "",
      b.website || "",
      b.avgRating || b.rating || 0,
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
    await pool.execute(query, params);
  }
}

