require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const { getPool } = require("./db");

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "https://vanigan-digital-new.vercel.app",
    "http://localhost:3001",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMBERS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/public/members
app.get("/api/public/members", async (req, res) => {
  const { epic, mobile, pin, search, district, assembly } = req.query;
  const page  = Math.max(1, parseInt(req.query.page  || "1",  10));
  const limit = Math.max(1, parseInt(req.query.limit || "12", 10));

  try {
    const pool = getPool();

    // Single member lookup by EPIC or mobile
    if (epic || mobile) {
      let rows;
      if (epic) {
        [rows] = await pool.execute(
          "SELECT * FROM member_list WHERE epic = ? LIMIT 1",
          [epic.trim().toUpperCase()]
        );
      } else {
        [rows] = await pool.execute(
          "SELECT * FROM member_list WHERE mobile = ? LIMIT 1",
          [mobile.trim()]
        );
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      const member = rows[0];

      // PIN verification (optional)
      if (pin !== undefined && member.pin !== pin) {
        return res.status(401).json({ error: "Invalid Security PIN" });
      }

      const { pin: _p, ...profile } = member;
      return res.json(profile);
    }

    // List members with filters + pagination
    let query      = "SELECT id, name, epic, mobile, email, dob, age, gender, bloodGroup, assembly, district, shop, type, address, years, wing, selfie, created_at FROM member_list WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM member_list WHERE 1=1";
    const params   = [];

    if (district) { query += " AND district = ?"; countQuery += " AND district = ?"; params.push(district); }
    if (assembly) { query += " AND assembly = ?"; countQuery += " AND assembly = ?"; params.push(assembly); }
    if (search) {
      const like = `%${search}%`;
      const s    = " AND (name LIKE ? OR epic LIKE ? OR mobile LIKE ? OR shop LIKE ? OR email LIKE ?)";
      query      += s; countQuery += s;
      params.push(like, like, like, like, like);
    }

    const [countRows] = await pool.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    const offset = (page - 1) * limit;
    query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await pool.execute(query, params);

    return res.json({ members: rows, total });
  } catch (err) {
    console.error("Members GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/public/members
app.post("/api/public/members", async (req, res) => {
  const { name, epic, mobile, email, dob, age, gender, bloodGroup,
          assembly, district, shop, type, address, years, wing,
          selfie, idProof, bizProof, pin } = req.body;

  if (!name || !epic || !mobile || !pin) {
    return res.status(400).json({ error: "Missing required fields: name, epic, mobile, pin" });
  }

  try {
    const pool = getPool();
    const [exists] = await pool.execute(
      "SELECT id FROM member_list WHERE epic = ? LIMIT 1",
      [epic.toUpperCase()]
    );
    if (exists.length > 0) {
      return res.status(409).json({ error: "Member with this EPIC already registered" });
    }

    await pool.execute(
      `INSERT INTO member_list (name, epic, mobile, email, dob, age, gender, bloodGroup,
       assembly, district, shop, type, address, years, wing, selfie, idProof, bizProof, pin, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, epic.toUpperCase(), mobile, email||null, dob||null,
       age ? parseInt(age,10) : null, gender||null, bloodGroup||null,
       assembly||null, district||null, shop||null, type||null,
       address||null, years||null, wing||null, selfie||null,
       idProof||null, bizProof||null, pin]
    );

    return res.json({ success: true, message: "Member registered successfully", epic: epic.toUpperCase() });
  } catch (err) {
    console.error("Members POST error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ORGANIZERS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/public/organizer
app.get("/api/public/organizer", async (req, res) => {
  const { search, district, assembly } = req.query;

  try {
    const pool = getPool();
    let query  = "SELECT id, organizer_code, name, mobile, email, role, district, assembly, status, created_at FROM organizer_list WHERE status = 'active'";
    const params = [];

    if (district) { query += " AND district = ?"; params.push(district); }
    if (assembly) { query += " AND assembly = ?"; params.push(assembly); }
    if (search) {
      const like = `%${search}%`;
      query += " AND (name LIKE ? OR role LIKE ? OR district LIKE ? OR assembly LIKE ?)";
      params.push(like, like, like, like);
    }
    query += " ORDER BY id ASC";

    const [rows] = await pool.execute(query, params);
    return res.json({ organizers: rows });
  } catch (err) {
    console.error("Organizer GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/public/organizer
app.post("/api/public/organizer", async (req, res) => {
  const { name, mobile, email, role, district, assembly } = req.body;

  if (!name || !mobile || !role || !district) {
    return res.status(400).json({ error: "Missing required fields: name, mobile, role, district" });
  }

  try {
    const pool = getPool();
    const organizer_code = `ORG${Date.now().toString().slice(-8)}`;

    await pool.execute(
      `INSERT INTO organizer_list (organizer_code, name, mobile, email, role, district, assembly, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [organizer_code, name, mobile, email||null, role, district, assembly||null]
    );

    return res.json({ success: true, message: "Organizer added successfully", organizerCode: organizer_code });
  } catch (err) {
    console.error("Organizer POST error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUSINESSES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/public/business
app.get("/api/public/business", async (req, res) => {
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

// GET /api/public/business/:id
app.get("/api/public/business/:id", async (req, res) => {
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

// POST /api/public/business
app.post("/api/public/business", async (req, res) => {
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

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/public/categories
app.get("/api/public/categories", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT category, COUNT(*) as count FROM business_list GROUP BY category ORDER BY count DESC"
    );
    const [totalRows] = await pool.execute("SELECT COUNT(*) as total FROM business_list");
    const [orgRows]   = await pool.execute("SELECT COUNT(*) as total FROM organizer_list");
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

// GET /api/public/categories/:category/subcategories
app.get("/api/public/categories/:category/subcategories", async (req, res) => {
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

// ═══════════════════════════════════════════════════════════════════════════════
// VOTER SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/voter-search
app.get("/api/voter-search", async (req, res) => {
  const { epic } = req.query;
  if (!epic) return res.status(400).json({ error: "epic query param required" });

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT id, name, epic, mobile, district, assembly, shop FROM member_list WHERE epic = ? LIMIT 1",
      [epic.trim().toUpperCase()]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Member not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Voter search error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  TNVS Backend running on http://localhost:${PORT}`);
  console.log(`   DB: ${process.env.DB_HOST || "127.0.0.1"}:${process.env.DB_PORT || 3306}/${process.env.DB_DATABASE || "vanigan"}`);
});
