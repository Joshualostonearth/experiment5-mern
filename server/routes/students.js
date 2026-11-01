import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// GET /api/students — list all students, newest first
router.get("/", async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).json({
      error: "Failed to fetch students",
    });
  }
});

// POST /api/students — validate and create a student
router.post("/", async (req, res) => {
  try {
    const { name, department, email } = req.body;

    // Validate that required fields are strings
    if (
      typeof name !== "string" ||
      typeof department !== "string" ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        error: "Name, department, and email must be strings",
      });
    }

    // Trim whitespace
    const cleanName = name.trim();
    const cleanDepartment = department.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Required-field validation
    if (!cleanName || !cleanDepartment || !cleanEmail) {
      return res.status(400).json({
        error: "Name, department, and email are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }

    // Create student
    const student = await Student.create({
      name: cleanName,
      department: cleanDepartment,
      email: cleanEmail,
    });

    return res.status(201).json(student);
  } catch (err) {
    // Handle duplicate email
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A student with this email already exists",
      });
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(
        (error) => error.message
      );

      return res.status(400).json({
        error: messages.join(". "),
      });
    }

    console.error("Error creating student:", err.message);

    return res.status(500).json({
      error: "Failed to create student",
    });
  }
});

export default router;