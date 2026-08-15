module.exports = {
  TASK_STATUSES: ['pending', 'in_progress', 'completed', 'blocked'],
  TASK_PRIORITIES: ['low', 'medium', 'high', 'urgent'],
  USER_ROLES: ['Admin', 'Member'],
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_SORT_BY: 'created_at',
  DEFAULT_SORT_ORDER: 'desc',
  ALLOWED_SORT_FIELDS: ['created_at', 'updated_at', 'due_date', 'title', 'priority', 'status']
};
