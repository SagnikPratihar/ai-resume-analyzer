import { query } from '../config/database.js'

const UserModel = {
  async findByEmail(email) {
    const [rows] = await query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    )
    return rows[0] || null
  },

  async findById(id) {
    const [rows] = await query(
      'SELECT id, name, email, avatar_url, is_active, is_verified, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    )
    return rows[0] || null
  },

  async create({ name, email, passwordHash }) {
    const [result] = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    )
    return result.insertId
  },

  async update(id, fields) {
    const entries  = Object.entries(fields)
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ')
    const values   = [...entries.map(([, val]) => val), id]

    await query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    )
  },
}

export default UserModel