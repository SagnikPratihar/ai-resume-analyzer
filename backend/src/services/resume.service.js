import path from "path";
import fs from "fs";
import axios from "axios";
import ResumeModel from "../models/resume.model.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

const ResumeService = {
  async uploadResume(userId, file) {
    const resumeId = await ResumeModel.create({
      userId,
      title: file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype.includes("pdf") ? "pdf" : "docx",
      fileSize: file.size,
    });

    ResumeService.parseResume(resumeId, file.path, file.mimetype).catch((err) =>
      logger.error(`Parse failed for resume ${resumeId}: ${err.message}`),
    );

    const resume = await ResumeModel.findById(resumeId);
    return resume;
  },

  async parseResume(resumeId, filePath, mimetype) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64File = fileBuffer.toString("base64");

      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/api/parse`,
        {
          file_data: base64File,
          file_type: mimetype.includes("pdf") ? "pdf" : "docx",
          resume_id: resumeId,
        },
        { timeout: 30000 },
      );

      if (response.data.success) {
        await ResumeModel.updateParsedText(resumeId, response.data.text);
        logger.info(`Resume ${resumeId} parsed successfully`);
      }
    } catch (error) {
      logger.error(
        `ML parse error for resume ${resumeId}: ${error.message}`,
      );
      await ResumeModel.markParseFailed(resumeId);
    }
  },

  async getUserResumes(userId) {
    return await ResumeModel.findByUserId(userId);
  },

  async getResume(resumeId, userId) {
    const resume = await ResumeModel.findById(resumeId);
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.user_id !== userId) {
      throw new AppError("Unauthorized", 403);
    }
    return resume;
  },

  async deleteResume(resumeId, userId) {
    const resume = await ResumeModel.findById(resumeId);
    if (!resume) throw new AppError("Resume not found", 404);
    if (resume.user_id !== userId) throw new AppError("Unauthorized", 403);

    if (fs.existsSync(resume.file_path)) {
      fs.unlinkSync(resume.file_path);
    }

    await ResumeModel.delete(resumeId);
  },
};

export default ResumeService;
