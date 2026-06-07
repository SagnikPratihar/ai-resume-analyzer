import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getResumeFeedback,
  enhanceBullets,
  generateInterviewQuestions,
} from "../controllers/ai.controller.js";

const router = Router();

router.use(authenticate);

router.post("/feedback/:resumeId", getResumeFeedback);
router.post("/enhance-bullets", enhanceBullets);
router.post("/interview-questions/:resumeId", generateInterviewQuestions);

export default router;
