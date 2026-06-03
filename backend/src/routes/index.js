import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Resume Analyzer API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

export default router