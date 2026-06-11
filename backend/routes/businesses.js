const express = require("express");
const { getPool } = require("../db");

const router = express.Router();

// GET /api/public/business -> maps to router.get("/business")
router.get("/business", async (req, res) => {
  const { id, category, subCategory, search, district } = req.query;
  const page  = Math.max(1, parseInt(req.query.page  || "1",  10));
  const limit = Math.max(1, parseInt(req.query.limit || "12", 10));

  try {
    const pool = getPool();

    // Single business by ID
    if (id) {
      const [rows] = await pool.execute(
        "SELECT * FROM business_list WHERE _id = ? LIMIT 1", [id]
      );
      if (rows.length === 0) return res.json({ businesses: [], total: 0 });
      const biz = { ...rows[0], avgRating: Number(rows[0].rating) || 0 };
      return res.json({ businesses: [biz], total: 1 });
    }

    // List with filters
    let query      = "SELECT * FROM business_list WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM business_list WHERE 1=1";
    const params   = [];

    if (category)    { query += " AND category = ?";    countQuery += " AND category = ?";    params.push(category); }
    if (subCategory) { query += " AND subCategory = ?"; countQuery += " AND subCategory = ?"; params.push(subCategory); }
    if (district)    { query += " AND district = ?";    countQuery += " AND district = ?";    params.push(district); }
    if (search) {
      const like = `%${search}%`;
      const s = " AND (name LIKE ? OR description LIKE ? OR address LIKE ? OR category LIKE ? OR subCategory LIKE ?)";
      query += s; countQuery += s;
      params.push(like, like, like, like, like);
    }

    const [countRows] = await pool.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    const offset = (page - 1) * limit;
    query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await pool.execute(query, params);

    const businesses = rows.map(r => ({ ...r, avgRating: Number(r.rating) || 0 }));
    return res.json({ businesses, total });
  } catch (err) {
    console.error("Business GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/public/business/:id -> maps to router.get("/business/:id")
router.get("/business/:id", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM business_list WHERE _id = ? LIMIT 1", [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Business not found" });
    const biz = { ...rows[0], avgRating: Number(rows[0].rating) || 0 };
    return res.json(biz);
  } catch (err) {
    console.error("Business/:id GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/public/business -> maps to router.post("/business")
router.post("/business", async (req, res) => {
  const { name, phone, category, district, address } = req.body;
  if (!name || !phone || !category || !district || !address) {
    return res.status(400).json({ error: "Missing required fields: name, phone, category, district, address" });
  }

  try {
    const pool = getPool();
    const ts   = Date.now();
    const _id  = `${ts}${Math.random().toString(36).substring(2, 10)}`;
    const listingCode = `VAN${ts.toString().slice(-8)}`;

    await pool.execute(
      `INSERT INTO business_list (_id, name, listingCode, description, category, subCategory,
       phone, phone2, email, website, city, district, assembly, address, pincode, landmark,
       coverImage, img, image, imageUrl, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [_id, name, listingCode, req.body.description||null, category, req.body.subCategory||null,
       phone, req.body.phone2||null, req.body.email||null, req.body.website||null,
       req.body.city||null, district, req.body.assembly||null, address,
       req.body.pincode||null, req.body.landmark||null,
       req.body.coverImage||null, req.body.coverImage||null,
       req.body.coverImage||null, req.body.coverImage||null]
    );

    return res.json({ success: true, businessId: _id, listingCode });
  } catch (err) {
    console.error("Business POST error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/public/categories -> maps to router.get("/categories")
router.get("/categories", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT category, COUNT(*) as count FROM business_list GROUP BY category ORDER BY count DESC"
    );
    const [totalRows] = await pool.execute("SELECT COUNT(*) as total FROM business_list");
    const [subRows]   = await pool.execute(
      "SELECT COUNT(DISTINCT subCategory) as total FROM business_list WHERE subCategory IS NOT NULL AND subCategory != ''"
    );

    return res.json({
      categories: rows.map(r => ({ category: r.category, count: r.count })),
      stats: {
        totalBusinesses:   totalRows[0]?.total || 0,
        totalCategories:   rows.length,
        totalSubCategories: subRows[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error("Categories GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/public/categories/:category/subcategories -> maps to router.get("/categories/:category/subcategories")
router.get("/categories/:category/subcategories", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT subCategory, COUNT(*) as count FROM business_list WHERE category = ? AND subCategory IS NOT NULL GROUP BY subCategory ORDER BY count DESC",
      [req.params.category]
    );
    return res.json({ subCategories: rows });
  } catch (err) {
    console.error("Subcategories GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
