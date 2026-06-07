import { Router } from "express";
import authRoutes from "./auth.routes.js";
import resumeRoutes from "./resume.routes.js";
import analysisRoutes from "./analysis.routes.js";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/resumes", resumeRoutes);
router.use("/analyses", analysisRoutes);
router.use("/ai", aiRoutes);

export default router;
