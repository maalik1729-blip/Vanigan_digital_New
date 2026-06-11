const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// GET /api/public/categories
router.get("/", async (req, res) => {
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

// GET /api/public/categories/:category/subcategories
router.get("/:category/subcategories", async (req, res) => {
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
