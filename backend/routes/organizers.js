const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// GET /api/public/organizer
router.get("/", async (req, res) => {
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
router.post("/", async (req, res) => {
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

module.exports = router;
