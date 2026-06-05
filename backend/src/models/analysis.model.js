import { query } from "../config/database.js";

const AnalysisModel = {
  async create({ userId, resumeId }) {
    const [result] = await query(
      `INSERT INTO analyses (user_id, resume_id, status)
       VALUES (?, ?, 'pending')`,
      [userId, resumeId],
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await query("SELECT * FROM analyses WHERE id = ? LIMIT 1", [
      id,
    ]);
    return rows[0] || null;
  },

  async findByResumeId(resumeId) {
    const [rows] = await query(
      `SELECT * FROM analyses
       WHERE resume_id = ?
       ORDER BY created_at DESC`,
      [resumeId],
    );
    return rows;
  },

  async findByUserId(userId) {
    const [rows] = await query(
      `SELECT a.*, r.title as resume_title, r.file_type
       FROM analyses a
       JOIN resumes r ON a.resume_id = r.id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [userId],
    );
    return rows;
  },

  async updateATSScores(id, scores) {
    await query(
      `UPDATE analyses SET
        ats_score         = ?,
        keyword_score     = ?,
        format_score      = ?,
        readability_score = ?,
        matched_skills    = ?,
        status            = 'completed'
       WHERE id = ?`,
      [
        scores.ats_score,
        scores.keyword_score,
        scores.format_score,
        scores.content_score,
        JSON.stringify(scores.found_keywords),
        id,
      ],
    );
  },

  async updateStatus(id, status) {
    await query("UPDATE analyses SET status = ? WHERE id = ?", [status, id]);
  },
};

export default AnalysisModel;
