import AnalysisService from '../services/analysis.service.js'

export const analyzeResume = async (req, res, next) => {
  try {
    const analysis = await AnalysisService.analyzeResume(
      parseInt(req.params.resumeId),
      req.user.id
    )
    res.status(201).json({
      success: true,
      message: 'Analysis complete',
      data: { analysis },
    })
  } catch (err) {
    next(err)
  }
}

export const getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await AnalysisService.getUserAnalyses(req.user.id)
    res.json({ success: true, data: { analyses } })
  } catch (err) {
    next(err)
  }
}

export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await AnalysisService.getAnalysis(
      parseInt(req.params.id),
      req.user.id
    )
    res.json({ success: true, data: { analysis } })
  } catch (err) {
    next(err)
  }
}