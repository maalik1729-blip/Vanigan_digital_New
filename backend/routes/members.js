const express = require("express");
const { getPool } = require("../db");

const router = express.Router();

// GET /api/public/members -> maps to router.get("/")
router.get("/", async (req, res) => {
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

// POST /api/public/members -> maps to router.post("/")
router.post("/", async (req, res) => {
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

module.exports = router;
