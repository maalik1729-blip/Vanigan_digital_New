import express, { Request, Response } from "express";
import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

// GET /api/public/members -> maps to router.get("/")
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { epic, mobile, pin, search, district, assembly } = req.query as Record<string, string>;
  const page  = Math.max(1, parseInt((req.query.page as string)  || "1",  10));
  const limit = Math.max(1, parseInt((req.query.limit as string) || "12", 10));

  try {
    // Single member lookup by EPIC or mobile
    if (epic || mobile) {
      const member = await prisma.member_list.findFirst({
        where: epic ? { epic: epic.trim().toUpperCase() } : { mobile: mobile.trim() }
      });

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      // PIN verification (optional)
      if (pin !== undefined && member.pin !== pin) {
        return res.status(401).json({ error: "Invalid Security PIN" });
      }

      const { pin: _p, ...profile } = member;
      return res.json(profile);
    }

    // List members with filters + pagination
    const whereClause: Prisma.member_listWhereInput = {};

    if (district) whereClause.district = district;
    if (assembly) whereClause.assembly = assembly;
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { epic: { contains: search } },
        { mobile: { contains: search } },
        { shop: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const [total, members] = await Promise.all([
      prisma.member_list.count({ where: whereClause }),
      prisma.member_list.findMany({
        where: whereClause,
        orderBy: { id: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true, name: true, epic: true, mobile: true, email: true,
          dob: true, age: true, gender: true, bloodGroup: true,
          assembly: true, district: true, shop: true, type: true,
          address: true, years: true, wing: true, selfie: true,
          created_at: true
        }
      })
    ]);

    return res.json({ members, total });
  } catch (err: any) {
    console.error("Members GET error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/public/members -> maps to router.post("/")
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { name, epic, mobile, email, dob, age, gender, bloodGroup,
          assembly, district, shop, type, address, years, wing,
          selfie, idProof, bizProof, pin } = req.body;

  if (!name || !epic || !mobile || !pin) {
    return res.status(400).json({ error: "Missing required fields: name, epic, mobile, pin" });
  }

  try {
    const exists = await prisma.member_list.findUnique({
      where: { epic: epic.toUpperCase() }
    });

    if (exists) {
      return res.status(409).json({ error: "Member with this EPIC already registered" });
    }

    await prisma.member_list.create({
      data: {
        name,
        epic: epic.toUpperCase(),
        mobile,
        email: email || null,
        dob: dob || null,
        age: age ? parseInt(age, 10) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        assembly: assembly || null,
        district: district || null,
        shop: shop || null,
        type: type || null,
        address: address || null,
        years: years || null,
        wing: wing || null,
        selfie: selfie || null,
        idProof: idProof || null,
        bizProof: bizProof || null,
        pin
      }
    });

    return res.json({ success: true, message: "Member registered successfully", epic: epic.toUpperCase() });
  } catch (err: any) {
    console.error("Members POST error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
