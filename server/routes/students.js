import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// ── GET /api/students — list all students, newest first ──────────────
router.get("/", async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// ── POST /api/students — validate and create a student ───────────────
router.post("/", async (req, res) => {
  try {
    const { name, department, email } = req.body;

    // Server-side required-field validation
    const missing = [];
    if (!name || !name.trim()) missing.push("Name");
    if (!department || !department.trim()) missing.push("Department");
    if (!email || !email.trim()) missing.push("Email");

    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing required fields: ${missing.join(", ")}` });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    const student = await Student.create({
      name: name.trim(),
      department: department.trim(),
      email: email.trim(),
    });

    res.status(201).json(student);
  } catch (err) {
    // Handle duplicate email (MongoDB error code 11000)
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "A student with this email already exists" });
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(". ") });
    }

    console.error("Error creating student:", err.message);
    res.status(500).json({ error: "Failed to create student" });
  }
});

export default router;

