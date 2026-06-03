import logger from '../utils/logger.js'

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true 
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | Route: ${req.originalUrl} | Method: ${req.method}`)
  const statusCode = err.statusCode || 500
  const message    = err.isOperational ? err.message : 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler