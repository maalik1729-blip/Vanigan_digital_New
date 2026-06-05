import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute(
  "/api/public/categories/$category/subcategories"
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const category = decodeURIComponent(params.category);
        try {
          const pool = getDbPool();
          const [rows]: any = await pool.execute(
            "SELECT DISTINCT subCategory FROM businesses WHERE category = ? AND subCategory IS NOT NULL AND subCategory != '' ORDER BY subCategory ASC",
            [category]
          );
          
          const subcategories = rows.map((r: any) => r.subCategory);
          return Response.json(subcategories);
        } catch (error: any) {
          console.error(`Local database error fetching subcategories for category ${category}:`, error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
