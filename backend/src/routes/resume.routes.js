import { Router } from "express";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  uploadResume,
  getUserResumes,
  getResume,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(authenticate);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getUserResumes);
router.get("/:id", getResume);
router.delete("/:id", deleteResume);

export default router;
