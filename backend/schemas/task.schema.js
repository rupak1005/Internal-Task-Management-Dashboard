const Joi = require('joi');
const { TASK_STATUSES, TASK_PRIORITIES, ALLOWED_SORT_FIELDS } = require('../utils/constants');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    'string.empty': 'Task title cannot be empty',
    'string.min': 'Task title must be at least 3 characters long',
    'any.required': 'Task title is required'
  }),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid(...TASK_STATUSES).default('pending'),
  priority: Joi.string().valid(...TASK_PRIORITIES).default('medium'),
  assigned_to: Joi.number().integer().positive().allow(null).optional(),
  due_date: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be a valid ISO date string'
  })
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid(...TASK_STATUSES).optional(),
  priority: Joi.string().valid(...TASK_PRIORITIES).optional(),
  assigned_to: Joi.number().integer().positive().allow(null).optional(),
  due_date: Joi.date().iso().allow(null).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const patchStatusSchema = Joi.object({
  status: Joi.string().valid(...TASK_STATUSES).required().messages({
    'any.required': 'Status is required',
    'any.only': `Status must be one of: ${TASK_STATUSES.join(', ')}`
  })
});

const queryTasksSchema = Joi.object({
  status: Joi.string().valid(...TASK_STATUSES, '').optional(),
  priority: Joi.string().valid(...TASK_PRIORITIES, '').optional(),
  assignee: Joi.alternatives().try(Joi.number().integer(), Joi.string().valid('unassigned', '')).optional(),
  search: Joi.string().trim().allow('').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort_by: Joi.string().valid(...ALLOWED_SORT_FIELDS).default('created_at'),
  order: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  patchStatusSchema,
  queryTasksSchema
};
