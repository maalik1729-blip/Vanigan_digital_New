import { createFileRoute } from "@tanstack/react-router";
import demoVoters from "@/data/voters.json";

type VoterRow = typeof demoVoters[number];

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "voter_db",
};

function filterDemo(epic?: string, mobile?: string, name?: string): VoterRow[] {
  let results: VoterRow[] = demoVoters;
  if (epic)   results = results.filter(v => v.EPIC_NO?.toUpperCase() === epic.toUpperCase());
  if (mobile) results = results.filter(v => v.MOBILE_NUMBER === mobile);
  if (name && !epic && !mobile) {
    const q = name.toLowerCase();
    results = results.filter(v => v.VOTER_NAME?.toLowerCase().includes(q));
  }
  return results.slice(0, 5);
}

export const Route = createFileRoute("/api/voter-search")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const epic   = url.searchParams.get("epic")?.trim().toUpperCase() || undefined;
        const mobile = url.searchParams.get("mobile")?.trim() || undefined;
        const name   = url.searchParams.get("name")?.trim() || undefined;

        if (!epic && !mobile && !name) {
          return Response.json({ error: "Provide epic, mobile, or name" }, { status: 400 });
        }

        // Try MySQL (only available in local dev with XAMPP running)
        try {
          const mysql = await import("mysql2/promise");
          const conn = await mysql.createConnection(DB_CONFIG);
          try {
            let query = "SELECT * FROM ass_25 WHERE 1=1";
            const params: string[] = [];
            if (epic)   { query += " AND EPIC_NO = ?";          params.push(epic); }
            if (mobile) { query += " AND MOBILE_NUMBER = ?";    params.push(mobile); }
            if (name && !epic && !mobile) { query += " AND VOTER_NAME LIKE ?"; params.push(`%${name}%`); }
            query += " LIMIT 5";
            const [rows] = await conn.execute(query, params);
            return Response.json({ voters: rows });
          } finally {
            conn.end();
          }
        } catch {
          // MySQL not available (production) — serve bundled demo data
          return Response.json({ voters: filterDemo(epic, mobile, name) });
        }
      },
    },
  },
});
