import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute("/api/public/organizer")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get("search")?.trim() || undefined;
        const district = url.searchParams.get("district")?.trim() || undefined;
        const assembly = url.searchParams.get("assembly")?.trim() || undefined;

        try {
          const pool = getDbPool();

          let query = "SELECT id, organizer_code, name, mobile, email, role, district, assembly, status, created_at FROM organizer_list WHERE status = 'active'";
          const params: any[] = [];

          if (district) {
            query += " AND district = ?";
            params.push(district);
          }

          if (assembly) {
            query += " AND assembly = ?";
            params.push(assembly);
          }

          if (search) {
            const likePat = `%${search}%`;
            query += " AND (name LIKE ? OR role LIKE ? OR district LIKE ? OR assembly LIKE ?)";
            params.push(likePat, likePat, likePat, likePat);
          }

          query += " ORDER BY id ASC";
          const [rows]: any = await pool.execute(query, params);

          return Response.json({ organizers: rows });
        } catch (error: any) {
          console.error("Local database error listing organizers:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
