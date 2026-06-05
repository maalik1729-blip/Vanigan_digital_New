import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute("/api/categories")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const pool = getDbPool();
          const [rows] = await pool.execute(
            "SELECT category, COUNT(*) as count FROM businesses WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY category ASC"
          );
          
          return Response.json(rows);
        } catch (error: any) {
          console.error("Local database error fetching categories:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
