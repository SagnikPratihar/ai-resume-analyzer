import { query } from "../config/database.js";

const ResumeModel = {
  async create({ userId, title, fileName, filePath, fileType, fileSize }) {
    const [result] = await query(
      `INSERT INTO resumes
        (user_id, title, file_name, file_path, file_type, file_size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, fileName, filePath, fileType, fileSize],
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await query("SELECT * FROM resumes WHERE id = ? LIMIT 1", [
      id,
    ]);
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await query(
      "SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );
    return rows;
  },

  async updateParsedText(id, parsedText) {
    await query(
      "UPDATE resumes SET parsed_text = ?, is_parsed = TRUE WHERE id = ?",
      [parsedText, id],
    );
  },

  async markParseFailed(id) {
    await query("UPDATE resumes SET is_parsed = FALSE WHERE id = ?", [id]);
  },

  async delete(id) {
    await query("DELETE FROM resumes WHERE id = ?", [id]);
  },
};

export default ResumeModel;
