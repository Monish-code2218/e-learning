import express from "express";
import {
  addLecture,
  fetchLectures,
  fetchLecture,
  updateLecture,
  deleteLecture,
  fetchAllLectures
} from "../controllers/LectureController.js";

const router = express.Router();

// ✅ Get all lectures
router.get("/", fetchAllLectures);

// ✅ Create a new lecture 
router.post("/", addLecture);

// ✅ Get all lectures for a specific course
router.get("/:id", fetchLectures);

// ✅ Get a single lecture by ID
router.get("/single/:id", fetchLecture);

// ✅ Update a lecture 
router.put("/:id", updateLecture);

// ✅ Delete a lecture 
router.delete("/:id", deleteLecture);

export default router;
