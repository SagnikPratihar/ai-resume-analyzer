import bcrypt from 'bcryptjs'
import UserModel from '../models/user.model.js'
import { generateToken } from '../utils/jwt.utils.js'
import { AppError } from '../middlewares/errorHandler.js'

const AuthService = {
  async register({ name, email, password }) {
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      throw new AppError('Email already registered', 409)
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = await UserModel.create({ name, email, passwordHash })
    const user = await UserModel.findById(userId)

    const token = generateToken({ userId: user.id, email: user.email })

    return { user, token }
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }
    if (!user.is_active) {
      throw new AppError('Account has been deactivated', 403)
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401)
    }
    const token = generateToken({ userId: user.id, email: user.email })
    const { password_hash, ...safeUser } = user

    return { user: safeUser, token }
  },

  async getMe(userId) {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }
    return user
  },
}

export default AuthService