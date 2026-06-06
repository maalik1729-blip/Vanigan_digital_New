import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute("/api/categories")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const pool = getDbPool();
          
          // 1. Fetch categories with business counts
          const [categoriesRows]: any = await pool.execute(
            "SELECT category, COUNT(*) as count FROM business_list WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY category ASC"
          );
          
          // 2. Fetch total count stats
          const [bizCountRows]: any = await pool.execute("SELECT COUNT(*) as count FROM business_list");
          const [catCountRows]: any = await pool.execute(
            "SELECT COUNT(DISTINCT category) as count FROM business_list WHERE category IS NOT NULL AND category != ''"
          );
          const [subCatCountRows]: any = await pool.execute(
            "SELECT COUNT(DISTINCT subCategory) as count FROM business_list WHERE subCategory IS NOT NULL AND subCategory != ''"
          );
          
          return Response.json({
            categories: categoriesRows,
            stats: {
              totalBusinesses: bizCountRows[0]?.count || 0,
              totalCategories: catCountRows[0]?.count || 0,
              totalSubCategories: subCatCountRows[0]?.count || 0,
            }
          });
        } catch (error: any) {
          console.error("Local database error fetching categories and stats:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
