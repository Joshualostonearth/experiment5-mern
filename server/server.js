import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import studentRoutes from "./routes/students.js";

// ── Load environment variables ───────────────────────────────────────
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (!MONGO_URI) {
  console.error(
    "❌  MONGO_URI is not set. Create a server/.env file with your Atlas connection string.\n" +
      "   See server/.env.example for the format."
  );
  process.exit(1);
}

// ── Express app ──────────────────────────────────────────────────────
const app = express();

// Security headers
app.use(helmet());

// CORS – allow only the configured frontend origin
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  })
);

// Parse JSON bodies
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/students", studentRoutes);

// ── Global error handler (never leak internals) ──────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Connect to MongoDB Atlas, then start listening ───────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅  Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀  Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Log the error but never log the full URI (contains credentials)
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });

