import axios from "axios";
import AnalysisModel from "../models/analysis.model.js";
import ResumeModel from "../models/resume.model.js";
import JDModel from "../models/jd.model.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

const AnalysisService = {
  async analyzeResume(resumeId, userId) {
    const resume = await ResumeModel.findById(resumeId);
    if (!resume) throw new AppError("Resume not found", 404);
    if (resume.user_id !== userId) throw new AppError("Unauthorized", 403);
    if (!resume.is_parsed)
      throw new AppError("Resume is still being parsed. Please wait.", 400);
    if (!resume.parsed_text)
      throw new AppError("Resume text could not be extracted", 400);

    const analysisId = await AnalysisModel.create({ userId, resumeId });

    try {
      await AnalysisModel.updateStatus(analysisId, "processing");

      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/api/ats/score`,
        { resume_text: resume.parsed_text, resume_id: resumeId },
        { timeout: 30000 },
      );

      if (response.data.success) {
        await AnalysisModel.updateATSScores(analysisId, response.data);
        logger.info(
          `ATS analysis ${analysisId} complete: ${response.data.ats_score}`,
        );
      }
    } catch (error) {
      await AnalysisModel.updateStatus(analysisId, "failed");
      logger.error(`ATS analysis failed: ${error.message}`);
      throw new AppError("Analysis failed. Please try again.", 500);
    }

    return await AnalysisModel.findById(analysisId);
  },

  async matchWithJD(resumeId, userId, jdData) {
    // 1. Get resume
    const resume = await ResumeModel.findById(resumeId);
    if (!resume) throw new AppError("Resume not found", 404);
    if (resume.user_id !== userId) throw new AppError("Unauthorized", 403);
    if (!resume.parsed_text) throw new AppError("Resume not parsed yet", 400);

    const jdId = await JDModel.create({
      userId,
      title: jdData.title,
      company: jdData.company,
      description: jdData.description,
    });

    const analysisId = await AnalysisModel.create({ userId, resumeId });
    await AnalysisModel.updateStatus(analysisId, "processing");

    try {
      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/api/match`,
        {
          resume_text: resume.parsed_text,
          jd_text: jdData.description,
          resume_id: resumeId,
        },
        { timeout: 60000 },
      );

      if (response.data.success) {
        await AnalysisModel.updateMatchScores(analysisId, {
          jdId,
          match_percentage: response.data.match_percentage,
          matched_skills: response.data.matched_skills,
          missing_skills: response.data.missing_skills,
        });
        logger.info(
          `JD match ${analysisId}: ${response.data.match_percentage}%`,
        );
      }
    } catch (error) {
      await AnalysisModel.updateStatus(analysisId, "failed");
      logger.error(`JD matching failed: ${error.message}`);
      throw new AppError("Matching failed. Please try again.", 500);
    }

    return await AnalysisModel.findById(analysisId);
  },

  async getUserAnalyses(userId) {
    return await AnalysisModel.findByUserId(userId);
  },

  async getAnalysis(analysisId, userId) {
    const analysis = await AnalysisModel.findById(analysisId);
    if (!analysis) throw new AppError("Analysis not found", 404);
    if (analysis.user_id !== userId) throw new AppError("Unauthorized", 403);
    return analysis;
  },
};

export default AnalysisService;
