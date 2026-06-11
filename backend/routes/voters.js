const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// GET /api/voter-search
router.get("/", async (req, res) => {
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

module.exports = router;
