import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, uploadFiles, createCourse);
router.post("/course/:id", isAuth, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, deleteCourse);
router.delete("/lecture/:id", isAuth, deleteLecture);
router.get("/stats", isAuth, getAllStats);
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, getAllUser);

export default router;
