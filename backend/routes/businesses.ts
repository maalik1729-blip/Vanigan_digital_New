import express, { Request, Response } from "express";
import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

// GET /api/public/business -> maps to router.get("/business")
router.get("/business", async (req: Request, res: Response): Promise<any> => {
  const { id, category, subCategory, search, district } = req.query as Record<string, string>;
  const page  = Math.max(1, parseInt((req.query.page as string)  || "1",  10));
  const limit = Math.max(1, parseInt((req.query.limit as string) || "12", 10));

  try {
    // Single business by UID
    if (id) {
      const biz = await prisma.business_list.findFirst({
        where: { uid: id }
      });
      if (!biz) return res.json({ businesses: [], total: 0 });
      return res.json({ businesses: [{ ...biz, avgRating: Number(biz.rating) || 0 }], total: 1 });
    }

    // List with filters
    const whereClause: Prisma.business_listWhereInput = {};

    if (category) whereClause.category = category;
    if (subCategory) whereClause.subCategory = subCategory;
    if (district) whereClause.district = district;
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
        { category: { contains: search } },
        { subCategory: { contains: search } }
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.business_list.count({ where: whereClause }),
      prisma.business_list.findMany({
        where: whereClause,
        orderBy: { id: "desc" },
        take: limit,
        skip: (page - 1) * limit
      })
    ]);

    const businesses = rows.map((r: any) => ({ ...r, avgRating: Number(r.rating) || 0 }));
    return res.json({ businesses, total });
  } catch (err: any) {
    console.error("Business GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/public/business/:id -> maps to router.get("/business/:id")
router.get("/business/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const biz = await prisma.business_list.findFirst({
      where: { uid: req.params.id as string }
    });
    if (!biz) return res.status(404).json({ error: "Business not found" });
    return res.json({ ...biz, avgRating: Number(biz.rating) || 0 });
  } catch (err: any) {
    console.error("Business/:id GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/public/business -> maps to router.post("/business")
router.post("/business", async (req: Request, res: Response): Promise<any> => {
  const { name, phone, category, district, address } = req.body;
  if (!name || !phone || !category || !district || !address) {
    return res.status(400).json({ error: "Missing required fields: name, phone, category, district, address" });
  }

  try {
    const ts   = Date.now();
    const uid  = `${ts}${Math.random().toString(36).substring(2, 10)}`;
    const listingCode = `VAN${ts.toString().slice(-8)}`;

    await prisma.business_list.create({
      data: {
        uid,
        name,
        listingCode,
        description: req.body.description || null,
        category,
        subCategory: req.body.subCategory || null,
        phone,
        phone2: req.body.phone2 || null,
        email: req.body.email || null,
        website: req.body.website || null,
        city: req.body.city || null,
        district,
        assembly: req.body.assembly || null,
        address,
        pincode: req.body.pincode || null,
        landmark: req.body.landmark || null,
        coverImage: req.body.coverImage || null,
        img: req.body.coverImage || null,
        image: req.body.coverImage || null,
        imageUrl: req.body.coverImage || null
      }
    });

    return res.json({ success: true, businessId: uid, listingCode });
  } catch (err: any) {
    console.error("Business POST error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/public/categories -> maps to router.get("/categories")
router.get("/categories", async (req: Request, res: Response): Promise<any> => {
  try {
    const groups = await prisma.business_list.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } }
    });

    const totalBusinesses = await prisma.business_list.count();

    // In Prisma, counting distinct is a bit tricky, but we can group by subCategory
    // and filter out nulls
    const subGroups = await prisma.business_list.groupBy({
      by: ["subCategory"],
      where: {
        subCategory: { not: null, notIn: [""] }
      }
    });

    return res.json({
      categories: groups.map((g: any) => ({ category: g.category, count: g._count.category })),
      stats: {
        totalBusinesses,
        totalCategories: groups.length,
        totalSubCategories: subGroups.length,
      },
    });
  } catch (err: any) {
    console.error("Categories GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/public/categories/:category/subcategories -> maps to router.get("/categories/:category/subcategories")
router.get("/categories/:category/subcategories", async (req: Request, res: Response): Promise<any> => {
  try {
    const subGroups = await prisma.business_list.groupBy({
      by: ["subCategory"],
      where: {
        category: req.params.category as string,
        subCategory: { not: null, notIn: [""] }
      },
      _count: { subCategory: true },
      orderBy: { _count: { subCategory: "desc" } }
    });

    return res.json({
      subCategories: subGroups.map((g: any) => ({
        subCategory: g.subCategory,
        count: g._count.subCategory
      }))
    });
  } catch (err: any) {
    console.error("Subcategories GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
