import Joi from "joi";
import AnalysisService from "../services/analysis.service.js";

export const analyzeResume = async (req, res, next) => {
  try {
    const analysis = await AnalysisService.analyzeResume(
      parseInt(req.params.resumeId),
      req.user.id,
    );
    res.status(201).json({
      success: true,
      message: "Analysis complete",
      data: { analysis },
    });
  } catch (err) {
    next(err);
  }
};

export const matchWithJD = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(2).max(255).required(),
      company: Joi.string().max(255).allow("", null),
      description: Joi.string().min(50).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const analysis = await AnalysisService.matchWithJD(
      parseInt(req.params.resumeId),
      req.user.id,
      value,
    );

    res.status(201).json({
      success: true,
      message: "JD matching complete",
      data: { analysis },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await AnalysisService.getUserAnalyses(req.user.id);
    res.json({ success: true, data: { analyses } });
  } catch (err) {
    next(err);
  }
};

export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await AnalysisService.getAnalysis(
      parseInt(req.params.id),
      req.user.id,
    );
    res.json({ success: true, data: { analysis } });
  } catch (err) {
    next(err);
  }
};
