import { query } from "../config/database.js";

const JDModel = {
  async create({ userId, title, company, description }) {
    const [result] = await query(
      `INSERT INTO job_descriptions (user_id, title, company, description)
       VALUES (?, ?, ?, ?)`,
      [userId, title, company || null, description],
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await query(
      "SELECT * FROM job_descriptions WHERE id = ? LIMIT 1",
      [id],
    );
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await query(
      `SELECT * FROM job_descriptions
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },

  async delete(id) {
    await query("DELETE FROM job_descriptions WHERE id = ?", [id]);
  },
};

export default JDModel;
