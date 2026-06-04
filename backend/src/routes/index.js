import { Router } from "express";
import authRoutes from "./auth.routes.js";

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

export default router;
