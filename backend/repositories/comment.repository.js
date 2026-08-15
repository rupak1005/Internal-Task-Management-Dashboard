const { query } = require('../database/database');

class CommentRepository {
  async findByTaskId(taskId) {
    const sql = `
      SELECT 
        c.id,
        c.task_id,
        c.user_id,
        c.comment,
        c.created_at,
        u.name AS user_name,
        u.email AS user_email,
        u.avatar_url AS user_avatar,
        u.role AS user_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
    `;
    const res = await query(sql, [taskId]);
    return res.rows;
  }

  async create(taskId, userId, comment) {
    const sql = `
      INSERT INTO comments (task_id, user_id, comment)
      VALUES ($1, $2, $3)
      RETURNING id, task_id, user_id, comment, created_at
    `;
    const res = await query(sql, [taskId, userId, comment]);
    
    // Fetch with author metadata
    const commentId = res.rows[0].id;
    const fetchSql = `
      SELECT 
        c.id,
        c.task_id,
        c.user_id,
        c.comment,
        c.created_at,
        u.name AS user_name,
        u.email AS user_email,
        u.avatar_url AS user_avatar,
        u.role AS user_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    const fullRes = await query(fetchSql, [commentId]);
    return fullRes.rows[0];
  }

  async count() {
    const res = await query('SELECT COUNT(*)::int AS count FROM comments');
    return res.rows[0].count;
  }
}

module.exports = new CommentRepository();
