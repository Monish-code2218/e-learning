import TryCatch from "../middlewares/TryCatch.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Progress } from "../models/Progress.js";
import mongoose from "mongoose";

// ✅ Create a new lecture
export const addLecture = TryCatch(async (req, res) => {
  const { title, description, video, courseId } = req.body;

  if (!title || !description || !video || !courseId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const validCourseId = mongoose.Types.ObjectId.isValid(courseId) ? new mongoose.Types.ObjectId(courseId) : courseId;

  const lecture = await Lecture.create({
    title,
    description,
    video,
    course: validCourseId,
  });

  res.status(201).json({ message: "Lecture created successfully", lecture });
});

// ✅ Fetch all lectures across all courses
export const fetchAllLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find();
  res.json({ lectures });
});

// ✅ Fetch all lectures for a course
export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  res.json({ lectures });
});

// ✅ Fetch a single lecture by ID
export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  res.json({ lecture });
});

// ✅ Update a lecture
export const updateLecture = TryCatch(async (req, res) => {
  const { title, description, video } = req.body;

  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  lecture.title = title || lecture.title;
  lecture.description = description || lecture.description;
  lecture.video = video || lecture.video;

  await lecture.save();
  res.json({ message: "Lecture updated successfully", lecture });
});

// ✅ Delete a lecture
export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findByIdAndDelete(req.params.id);
  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  res.json({ message: "Lecture deleted successfully" });
});