import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

import membersRouter from "./routes/members.js";
import organizersRouter from "./routes/organizers.js";
import businessesRouter from "./routes/businesses.js";
import votersRouter from "./routes/voters.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "https://vanigan-digital-new.vercel.app",
    "http://localhost:3001",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/public/members", membersRouter);
app.use("/api/public/organizer", organizersRouter);
app.use("/api/public", businessesRouter);
app.use("/api/voter-search", votersRouter);


// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  TNVS Backend running on http://localhost:${PORT}`);
  console.log(`   DB: ${process.env.DB_HOST || "127.0.0.1"}:${process.env.DB_PORT || 3306}/${process.env.DB_DATABASE || "vanigan"}`);
});
