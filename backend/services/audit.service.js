const { query } = require('../database/database');

class AuditService {
  async log({ taskId, userId, userName, userAvatar, action, details, oldValues, newValues }) {
    try {
      await query(
        `INSERT INTO audit_logs (task_id, user_id, user_name, user_avatar, action, details, old_values, new_values)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          taskId || null,
          userId || null,
          userName || 'System',
          userAvatar || null,
          action,
          details || '',
          oldValues ? JSON.stringify(oldValues) : null,
          newValues ? JSON.stringify(newValues) : null,
        ]
      );
    } catch (err) {
      console.error('[AuditService Error]: Failed to record audit log:', err.message);
    }
  }

  async getTaskActivity(taskId) {
    const res = await query(
      `SELECT id, task_id, user_id, user_name, user_avatar, action, details, old_values, new_values, created_at
       FROM audit_logs
       WHERE task_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [taskId]
    );
    return res.rows;
  }

  async getAllLogs({ page = 1, limit = 20, action, userId }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (action) {
      conditions.push(`action = $${paramIndex}`);
      params.push(action);
      paramIndex++;
    }

    if (userId) {
      conditions.push(`user_id = $${paramIndex}`);
      params.push(userId);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) FROM audit_logs ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].count, 10);

    const listQuery = `
      SELECT id, task_id, user_id, user_name, user_avatar, action, details, old_values, new_values, created_at
      FROM audit_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const listRes = await query(listQuery, [...params, limit, offset]);

    return {
      data: listRes.rows,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

module.exports = new AuditService();
