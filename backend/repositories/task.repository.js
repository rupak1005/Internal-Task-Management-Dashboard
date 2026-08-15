const { query } = require('../database/database');
const { ALLOWED_SORT_FIELDS } = require('../utils/constants');

class TaskRepository {
  async findPaginated({
    status,
    priority,
    assignee,
    search,
    page = 1,
    limit = 10,
    sort_by = 'created_at',
    order = 'desc'
  }) {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Filter by status
    if (status && status.trim() !== '') {
      conditions.push(`t.status = $${paramIndex++}`);
      params.push(status.trim().toLowerCase());
    }

    // Filter by priority
    if (priority && priority.trim() !== '') {
      conditions.push(`t.priority = $${paramIndex++}`);
      params.push(priority.trim().toLowerCase());
    }

    // Filter by assignee
    if (assignee !== undefined && assignee !== null && assignee !== '') {
      if (assignee === 'unassigned' || assignee === 'null') {
        conditions.push(`t.assigned_to IS NULL`);
      } else if (!isNaN(Number(assignee))) {
        conditions.push(`t.assigned_to = $${paramIndex++}`);
        params.push(Number(assignee));
      }
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      conditions.push(`(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column & direction
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sort_by) ? `t.${sort_by}` : 't.created_at';
    const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM tasks t
      ${whereClause}
    `;
    const countRes = await query(countSql, params);
    const total = countRes.rows[0].total;

    // Pagination bounds
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const safePage = Math.max(1, Number(page) || 1);
    const offset = (safePage - 1) * safeLimit;
    const totalPages = Math.ceil(total / safeLimit) || 1;

    // Data query with join for assignee info and comment count
    const dataParams = [...params, safeLimit, offset];
    const dataSql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.assigned_to,
        t.due_date,
        t.created_at,
        t.updated_at,
        u.name AS assignee_name,
        u.email AS assignee_email,
        u.avatar_url AS assignee_avatar,
        COALESCE(c.comment_count, 0)::int AS comments_count
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN (
        SELECT task_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY task_id
      ) c ON t.id = c.task_id
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const dataRes = await query(dataSql, dataParams);

    return {
      items: dataRes.rows,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        total_pages: totalPages,
        has_next_page: safePage < totalPages,
        has_prev_page: safePage > 1
      }
    };
  }

  async findById(id) {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.assigned_to,
        t.due_date,
        t.created_at,
        t.updated_at,
        u.name AS assignee_name,
        u.email AS assignee_email,
        u.avatar_url AS assignee_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = $1
    `;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  }

  async create({ title, description = '', status = 'pending', priority = 'medium', assigned_to = null, due_date = null }) {
    const sql = `
      INSERT INTO tasks (title, description, status, priority, assigned_to, due_date, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const res = await query(sql, [title, description, status, priority, assigned_to, due_date]);
    return res.rows[0];
  }

  async update(id, fields) {
    const allowedFields = ['title', 'description', 'status', 'priority', 'assigned_to', 'due_date'];
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        setClauses.push(`${key} = $${paramIndex++}`);
        params.push(fields[key]);
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const sql = `
      UPDATE tasks
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const res = await query(sql, params);
    return res.rows[0] || null;
  }

  async patchStatus(id, status) {
    const sql = `
      UPDATE tasks
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const res = await query(sql, [status, id]);
    return res.rows[0] || null;
  }

  async delete(id) {
    const res = await query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    return res.rowCount > 0;
  }

  async count() {
    const res = await query('SELECT COUNT(*)::int AS count FROM tasks');
    return res.rows[0].count;
  }
}

module.exports = new TaskRepository();
