import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import studentRoutes from "./routes/students.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Check for MongoDB connection string
if (!MONGO_URI) {
  console.error(
    "MONGO_URI is not set. Create a server/.env file with your Atlas connection string.\n" +
    "See server/.env.example for the format."
  );
  process.exit(1);
}

// Create Express application
const app = express();

// ── Security: HTTP headers ────────────────────────────────────────
app.use(helmet());

// ── Security: CORS configuration ──────────────────────────────────
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  })
);

// ── Security: Rate limiting ────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Maximum 100 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

// Apply rate limiting to API endpoints
app.use("/api", apiLimiter);

// ── Parse JSON request bodies ──────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ── API Routes ─────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
  });
});

app.use("/api/students", studentRoutes);

// ── Handle unknown routes ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ── Global error handler ───────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);

  res.status(500).json({
    error: "Internal server error",
  });
});

// ── Connect to MongoDB Atlas and start server ──────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Never log the full MongoDB URI because it contains credentials
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });