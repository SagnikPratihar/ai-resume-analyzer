// src/routes/analysis.routes.js
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  analyzeResume,
  getUserAnalyses,
  getAnalysis,
} from "../controllers/analysis.controller.js";

const router = Router();

router.use(authenticate);

router.post("/resume/:resumeId", analyzeResume);
router.get("/", getUserAnalyses);
router.get("/:id", getAnalysis);

export default router;
