import { createFileRoute } from "@tanstack/react-router";
import { getDbPool, upsertBusinesses } from "@/lib/db";

export const Route = createFileRoute("/api/public/business")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id")?.trim();

        // 1. Fallback: single business details requested via query parameter
        if (id) {
          try {
            const pool = getDbPool();
            const [rows]: any = await pool.execute(
              "SELECT * FROM business_list WHERE _id = ? LIMIT 1",
              [id]
            );

            if (rows.length === 0) {
              return Response.json({ businesses: [], total: 0 });
            }

            const biz = {
              ...rows[0],
              avgRating: Number(rows[0].rating) || 0,
            };

            return Response.json({ businesses: [biz], total: 1 });
          } catch (error: any) {
            console.error(`Local database error fetching business with id ${id}:`, error);
            return Response.json({ error: error.message }, { status: 500 });
          }
        }

        const category = url.searchParams.get("category")?.trim() || undefined;
        const subCategory = url.searchParams.get("subCategory")?.trim() || undefined;
        const search = url.searchParams.get("search")?.trim() || undefined;
        const district = url.searchParams.get("district")?.trim() || undefined;
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "12", 10));

        try {
          const pool = getDbPool();

          let query = "SELECT * FROM business_list WHERE 1=1";
          let countQuery = "SELECT COUNT(*) as total FROM business_list WHERE 1=1";
          const params: any[] = [];

          if (category) {
            query += " AND category = ?";
            countQuery += " AND category = ?";
            params.push(category);
          }

          if (subCategory) {
            query += " AND subCategory = ?";
            countQuery += " AND subCategory = ?";
            params.push(subCategory);
          }

          if (district) {
            query += " AND district = ?";
            countQuery += " AND district = ?";
            params.push(district);
          }

          if (search) {
            const likePat = `%${search}%`;
            const searchSql = " AND (name LIKE ? OR description LIKE ? OR address LIKE ? OR category LIKE ? OR subCategory LIKE ?)";
            query += searchSql;
            countQuery += searchSql;
            params.push(likePat, likePat, likePat, likePat, likePat);
          }

          // Fetch total count first
          const [countRows]: any = await pool.execute(countQuery, params);
          const total = countRows[0]?.total || 0;

          // Add pagination and execute
          const offset = (page - 1) * limit;
          query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
          const [rows]: any = await pool.execute(query, params);

          const businesses = rows.map((r: any) => ({
            ...r,
            avgRating: Number(r.rating) || 0,
          }));

          return Response.json({ businesses, total });
        } catch (error: any) {
          console.error("Local database error listing businesses:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          if (!body.name || !body.phone || !body.category || !body.district || !body.address) {
            return Response.json(
              { error: "Missing required fields: name, phone, category, district, address" },
              { status: 400 }
            );
          }

          const pool = getDbPool();
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2, 15);
          const _id = `${timestamp}${randomId}`;
          const listingCode = `VAN${timestamp.toString().slice(-8)}`;

          const query = `
            INSERT INTO business_list (
              _id, name, listingCode, description, category, subCategory,
              phone, phone2, email, website, city, district, assembly, address,
              pincode, landmark, lat, lng, openDays, openTime, closeTime,
              coverImage, img, image, imageUrl, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;

          const values = [
            _id,
            body.name,
            listingCode,
            body.description || null,
            body.category,
            body.subCategory || null,
            body.phone,
            body.phone2 || null,
            body.email || null,
            body.website || null,
            body.city || null,
            body.district,
            body.assembly || null,
            body.address,
            body.pincode || null,
            body.landmark || null,
            body.lat || null,
            body.lng || null,
            body.openDays || null,
            body.openTime || null,
            body.closeTime || null,
            body.coverImage || null,
            body.coverImage || null,
            body.coverImage || null,
            body.coverImage || null,
          ];

          await pool.execute(query, values);

          return Response.json({
            success: true,
            message: "Business added successfully",
            businessId: _id,
            listingCode,
          });
        } catch (error: any) {
          console.error("Local database error adding business:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
