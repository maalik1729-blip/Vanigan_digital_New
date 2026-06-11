require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app  = express();
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
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Import Modular Routers ────────────────────────────────────────────────────
const membersRouter    = require("./routes/members");
const organizersRouter = require("./routes/organizers");
const businessesRouter  = require("./routes/businesses");
const categoriesRouter  = require("./routes/categories");
const votersRouter      = require("./routes/voters");

// ── Mount Routes ──────────────────────────────────────────────────────────────
app.use("/api/public/members",    membersRouter);
app.use("/api/public/organizer",  organizersRouter);
app.use("/api/public/business",   businessesRouter);
app.use("/api/public/categories", categoriesRouter);
app.use("/api/voter-search",      votersRouter);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  TNVS Backend running on http://localhost:${PORT}`);
  console.log(`   DB: ${process.env.DB_HOST || "127.0.0.1"}:${process.env.DB_PORT || 3306}/${process.env.DB_DATABASE || "vanigan"}`);
});
