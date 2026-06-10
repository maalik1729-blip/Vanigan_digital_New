import { createFileRoute } from "@tanstack/react-router";
import { getDbPool } from "@/lib/db";

export const Route = createFileRoute("/api/public/categories")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const pool = getDbPool();

          // Get all unique categories with counts
          const [rows]: any = await pool.execute(`
            SELECT 
              category,
              COUNT(*) as count
            FROM business_list
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY category ASC
          `);

          // Map categories with icons
          const categoryIcons: Record<string, string> = {
            "Hotels & Restaurants": "🍽️",
            "Caterers": "🥘",
            "Daily Needs": "🛒",
            "Organic Products": "🌿",
            "Doctors": "👨‍⚕️",
            "Hospitals & Clinics": "🏥",
            "Pharmacy": "💊",
            "Labs & Diagnostics": "🔬",
            "Spa & Beauty": "💅",
            "Education": "🎓",
            "IT & Software": "💻",
            "Electricals & Electronics": "⚡",
            "Construction Materials": "🧱",
            "Real Estate": "🏠",
            "Transport": "🚛",
            "Automobile": "🚘",
            "Textiles & Garments": "👗",
            "Jewellery": "💎",
            "Agriculture": "🌾",
            "Banking & Finance": "🏦",
            "Insurance": "🛡️",
            "Legal Services": "⚖️",
            "Jobs": "💼",
            "Advertising": "📢",
            "Printing Services": "🖨️",
            "Photography": "📸",
            "Wedding Services": "💒",
          };

          const categories = rows.map((row: any) => ({
            name: row.category,
            count: row.count,
            icon: categoryIcons[row.category] || "📦",
          }));

          return Response.json({ categories });
        } catch (error: any) {
          console.error("Error fetching categories:", error);
          return Response.json({ error: error.message }, { status: 500 });
        }
      },
    },
  },
});
