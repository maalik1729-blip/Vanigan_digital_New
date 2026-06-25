import express, { Request, Response } from "express";
import { prisma } from "../db.js";

const router = express.Router();

// GET /api/voter-search -> maps to router.get("/")
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { epic } = req.query;
  if (!epic || typeof epic !== "string") {
    return res.status(400).json({ error: "epic query param required" });
  }

  try {
    const member = await prisma.member_list.findUnique({
      where: { epic: epic.trim().toUpperCase() },
      select: {
        id: true,
        name: true,
        epic: true,
        mobile: true,
        district: true,
        assembly: true,
        shop: true
      }
    });

    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.json(member);
  } catch (err: any) {
    console.error("Voter search error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
