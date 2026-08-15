const { query } = require('../database/database');

class DashboardService {
  async getMetrics(userId = null) {
    // 1. Basic status counts & overdue count
    const metricsSql = `
      SELECT
        COUNT(*)::int AS total_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pending_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::int AS in_progress_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::int AS completed_tasks,
        COUNT(CASE WHEN status = 'blocked' THEN 1 END)::int AS blocked_tasks,
        COUNT(CASE WHEN due_date IS NOT NULL AND due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END)::int AS overdue_tasks,
        COUNT(CASE WHEN $1::int IS NOT NULL AND assigned_to = $1::int THEN 1 END)::int AS assigned_to_me
      FROM tasks;
    `;
    const metricsRes = await query(metricsSql, [userId]);
    const metrics = metricsRes.rows[0];

    // 2. Breakdown by priority
    const prioritySql = `
      SELECT 
        priority,
        COUNT(*)::int AS count
      FROM tasks
      GROUP BY priority
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
          ELSE 5
        END;
    `;
    const priorityRes = await query(prioritySql);

    // 3. Breakdown by status
    const statusSql = `
      SELECT 
        status,
        COUNT(*)::int AS count
      FROM tasks
      GROUP BY status
      ORDER BY 
        CASE status 
          WHEN 'in_progress' THEN 1
          WHEN 'pending' THEN 2
          WHEN 'blocked' THEN 3
          WHEN 'completed' THEN 4
          ELSE 5
        END;
    `;
    const statusRes = await query(statusSql);

    // 4. Overdue tasks list (up to 5)
    const overdueSql = `
      SELECT 
        t.id,
        t.title,
        t.status,
        t.priority,
        t.due_date,
        u.name AS assignee_name,
        u.avatar_url AS assignee_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.due_date IS NOT NULL AND t.due_date < CURRENT_TIMESTAMP AND t.status != 'completed'
      ORDER BY t.due_date ASC
      LIMIT 5;
    `;
    const overdueListRes = await query(overdueSql);

    // 5. Recent 5 tasks
    const recentTasksSql = `
      SELECT 
        t.id,
        t.title,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        u.name AS assignee_name,
        u.avatar_url AS assignee_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      ORDER BY t.created_at DESC
      LIMIT 5;
    `;
    const recentTasksRes = await query(recentTasksSql);

    // Calculate percentage rates
    const total = metrics.total_tasks || 0;
    const completionRate = total > 0 ? Math.round((metrics.completed_tasks / total) * 100) : 0;

    return {
      metrics: {
        total: metrics.total_tasks,
        pending: metrics.pending_tasks,
        in_progress: metrics.in_progress_tasks,
        completed: metrics.completed_tasks,
        blocked: metrics.blocked_tasks,
        overdue: metrics.overdue_tasks,
        assigned_to_me: metrics.assigned_to_me,
        completion_rate: completionRate
      },
      priority_distribution: priorityRes.rows,
      status_distribution: statusRes.rows,
      overdue_tasks: overdueListRes.rows,
      recent_tasks: recentTasksRes.rows
    };
  }
}

module.exports = new DashboardService();
