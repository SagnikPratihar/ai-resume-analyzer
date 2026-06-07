import Joi from "joi";
import AIService from "../services/ai.service.js";
import ResumeModel from "../models/resume.model.js";
import { AppError } from "../middlewares/errorHandler.js";

const getResumeText = async (resumeId, userId) => {
  const resume = await ResumeModel.findById(resumeId);
  if (!resume) throw new AppError("Resume not found", 404);
  if (resume.user_id !== userId) throw new AppError("Unauthorized", 403);
  if (!resume.parsed_text) throw new AppError("Resume not parsed yet", 400);
  return resume;
};

export const getResumeFeedback = async (req, res, next) => {
  try {
    const resume = await getResumeText(req.params.resumeId, req.user.id);
    const feedback = await AIService.getResumeFeedback(
      resume.parsed_text,
      req.body.job_title || "",
    );
    res.json({ success: true, data: { feedback } });
  } catch (err) {
    next(err);
  }
};

export const enhanceBullets = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      bullets: Joi.array().items(Joi.string()).min(1).max(10).required(),
      job_title: Joi.string().allow("", null),
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await AIService.enhanceBullets(
      value.bullets,
      value.job_title || "",
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const generateInterviewQuestions = async (req, res, next) => {
  try {
    const resume = await getResumeText(req.params.resumeId, req.user.id);
    const questions = await AIService.generateInterviewQuestions(
      resume.parsed_text,
      req.body.job_title || "",
    );
    res.json({ success: true, data: { questions } });
  } catch (err) {
    next(err);
  }
};
