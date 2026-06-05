import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute("/api/public/businesses/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params;
        try {
          const pool = getDbPool();
          const [rows]: any = await pool.execute(
            "SELECT * FROM business_list WHERE _id = ? LIMIT 1",
            [id]
          );

          if (rows.length === 0) {
            return Response.json({ error: "Business not found" }, { status: 404 });
          }

          const biz = {
            ...rows[0],
            avgRating: Number(rows[0].rating) || 0,
          };

          return Response.json(biz);
        } catch (error: any) {
          console.error(`Local database error fetching business detail for id ${id}:`, error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
