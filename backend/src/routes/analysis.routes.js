import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  analyzeResume,
  matchWithJD,
  getUserAnalyses,
  getAnalysis,
} from "../controllers/analysis.controller.js";

const router = Router();

router.use(authenticate);

router.post("/resume/:resumeId", analyzeResume);
router.post("/match/:resumeId", matchWithJD);
router.get("/", getUserAnalyses);
router.get("/:id", getAnalysis);

export default router;
