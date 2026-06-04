import { verifyToken } from '../utils/jwt.utils.js'
import UserModel from '../models/user.model.js'
import { AppError } from '../middlewares/errorHandler.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await UserModel.findById(decoded.userId)
    if (!user) {
      throw new AppError('User no longer exists', 401)
    }

    req.user = user
    next() 

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401))
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again.', 401))
    }
    next(error)
  }
}