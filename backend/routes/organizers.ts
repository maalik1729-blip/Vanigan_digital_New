import express, { Request, Response } from "express";
import { prisma } from "../db.js";
import { Prisma } from "@prisma/client/generated";

const router = express.Router();

// GET /api/public/organizer -> maps to router.get("/")
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { search, district, assembly } = req.query as Record<string, string>;

  try {
    const whereClause: Prisma.organizer_listWhereInput = {
      status: "active"
    };

    if (district) whereClause.district = district;
    if (assembly) whereClause.assembly = assembly;
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { role: { contains: search } },
        { district: { contains: search } },
        { assembly: { contains: search } }
      ];
    }

    const organizers = await prisma.organizer_list.findMany({
      where: whereClause,
      orderBy: { id: "asc" },
      select: {
        id: true,
        organizer_code: true,
        name: true,
        mobile: true,
        email: true,
        role: true,
        district: true,
        assembly: true,
        status: true,
        created_at: true
      }
    });

    return res.json({ organizers });
  } catch (err: any) {
    console.error("Organizer GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/public/organizer -> maps to router.post("/")
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { name, mobile, email, role, district, assembly } = req.body;

  if (!name || !mobile || !role || !district) {
    return res.status(400).json({ error: "Missing required fields: name, mobile, role, district" });
  }

  try {
    const organizer_code = `ORG${Date.now().toString().slice(-8)}`;

    // Need a default 4-digit pin since it's required in schema
    const defaultPin = "1234";

    await prisma.organizer_list.create({
      data: {
        organizer_code,
        name,
        mobile,
        email: email || null,
        role,
        district,
        assembly: assembly || null,
        status: "active",
        pin: defaultPin
      }
    });

    return res.json({ success: true, message: "Organizer added successfully", organizerCode: organizer_code });
  } catch (err: any) {
    console.error("Organizer POST error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
