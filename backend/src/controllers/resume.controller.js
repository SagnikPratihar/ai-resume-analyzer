import ResumeService from '../services/resume.service.js'

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const resume = await ResumeService.uploadResume(req.user.id, req.file)

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully. Parsing in progress...',
      data: { resume },
    })
  } catch (err) {
    next(err)
  }
}

export const getUserResumes = async (req, res, next) => {
  try {
    const resumes = await ResumeService.getUserResumes(req.user.id)
    res.json({
      success: true,
      data: { resumes },
    })
  } catch (err) {
    next(err)
  }
}

export const getResume = async (req, res, next) => {
  try {
    const resume = await ResumeService.getResume(
      parseInt(req.params.id),
      req.user.id
    )
    res.json({ success: true, data: { resume } })
  } catch (err) {
    next(err)
  }
}

export const deleteResume = async (req, res, next) => {
  try {
    await ResumeService.deleteResume(parseInt(req.params.id), req.user.id)
    res.json({ success: true, message: 'Resume deleted successfully' })
  } catch (err) {
    next(err)
  }
}