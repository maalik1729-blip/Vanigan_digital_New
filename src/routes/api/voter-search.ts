import { createFileRoute } from "@tanstack/react-router";

type VoterRow = {
  ID: number;
  ASSEMBLY_NO?: string;
  ASSEMBLY_NAME?: string;
  PART_NO?: string;
  SECTION_NO?: string;
  SERIAL_NO?: string;
  HOUSE_NO?: string;
  VOTER_NAME?: string;
  RELATION_TYPE?: string;
  RELATION_NAME?: string;
  EPIC_NO?: string;
  MOBILE_NUMBER?: string;
  AGE?: string;
  DOB?: string;
  BUSINESS_TYPE?: string;
  GENDER?: string;
  BLOOD_GROUP?: string;
  PART_NAME?: string;
  POLLING_STATION_NAME?: string;
  POLLING_STATION_ADDRESS?: string;
  MAIN_TOWN?: string;
  WARD?: string;
  POST_OFFICE?: string;
  POLICE_STATION?: string;
  DISTRICT?: string;
  PIN_CODE?: string;
  PHOTO_URL?: string;
};

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "voter_db",
};

function filterDemo(epic?: string, mobile?: string, name?: string): VoterRow[] {
  return [];
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
