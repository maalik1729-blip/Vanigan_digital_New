import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute("/api/public/members")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const epic = url.searchParams.get("epic")?.trim().toUpperCase();
        const mobile = url.searchParams.get("mobile")?.trim();
        const pin = url.searchParams.get("pin")?.trim();

        if (!epic && !mobile) {
          return Response.json({ error: "Missing epic or mobile query parameter" }, { status: 400 });
        }

        try {
          const pool = getDbPool();
          let rows: any = [];
          if (epic) {
            const [result]: any = await pool.execute(
              "SELECT * FROM member_list WHERE epic = ? LIMIT 1",
              [epic]
            );
            rows = result;
          } else if (mobile) {
            const [result]: any = await pool.execute(
              "SELECT * FROM member_list WHERE mobile = ? LIMIT 1",
              [mobile]
            );
            rows = result;
          }

          if (rows.length === 0) {
            return Response.json({ error: "Member not found" }, { status: 404 });
          }

          const member = rows[0];

          // If a pin is provided, verify it. Otherwise, return the profile (safe fields).
          if (pin !== undefined) {
            if (member.pin !== pin) {
              return Response.json({ error: "Invalid Security PIN" }, { status: 401 });
            }
          }

          // Exclude pin from response
          const { pin: _, ...profile } = member;
          return Response.json(profile);
        } catch (error: any) {
          console.error("Local database error fetching member:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const {
            name,
            epic,
            mobile,
            email,
            dob,
            age,
            gender,
            bloodGroup,
            assembly,
            district,
            shop,
            type,
            address,
            years,
            wing,
            selfie,
            idProof,
            shopPhoto,
            bizProof,
            pin,
          } = body;

          if (!name || !epic || !mobile || !pin) {
            return Response.json(
              { error: "Missing required fields: name, epic, mobile, pin" },
              { status: 400 }
            );
          }

          const pool = getDbPool();

          // Check if member already exists
          const [exists]: any = await pool.execute(
            "SELECT id FROM member_list WHERE epic = ? LIMIT 1",
            [epic.toUpperCase()]
          );
          if (exists.length > 0) {
            return Response.json(
              { error: "Member with this EPIC / ID already registered" },
              { status: 409 }
            );
          }

          const query = `
            INSERT INTO member_list (
              name, epic, mobile, email, dob, age, gender, bloodGroup,
              assembly, district, shop, type, address, years, wing,
              selfie, idProof, shopPhoto, bizProof, pin, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;

          const values = [
            name,
            epic.toUpperCase(),
            mobile,
            email || null,
            dob || null,
            age ? parseInt(age, 10) : null,
            gender || null,
            bloodGroup || null,
            assembly || null,
            district || null,
            shop || null,
            type || null,
            address || null,
            years || null,
            wing || null,
            selfie || null,
            idProof || null,
            shopPhoto || null,
            bizProof || null,
            pin,
          ];

          await pool.execute(query, values);

          return Response.json({
            success: true,
            message: "Member registered successfully",
            epic: epic.toUpperCase(),
          });
        } catch (error: any) {
          console.error("Local database error registering member:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
