const express = require('express');
const router = express.Router();
const taskService = require('../services/task.service');
const auditService = require('../services/audit.service');
const { optionalAuth, authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  patchStatusSchema,
  queryTasksSchema
} = require('../schemas/task.schema');
const { createCommentSchema } = require('../schemas/comment.schema');

// Middleware for validating request body/query
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessages = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errorMessages
    });
  }
  req[property] = value;
  next();
};

// GET /api/tasks (paginated, filtered, searched, sorted)
router.get('/', validate(queryTasksSchema, 'query'), async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.query);
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const task = await taskService.getTaskById(taskId);
    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id/activity
router.get('/:id/activity', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const activity = await auditService.getTaskActivity(taskId);
    res.json({
      success: true,
      data: activity
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post('/', optionalAuth, validate(createTaskSchema, 'body'), async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id
router.put('/:id', optionalAuth, validate(updateTaskSchema, 'body'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const task = await taskService.updateTask(taskId, req.body, req.user);
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', optionalAuth, validate(patchStatusSchema, 'body'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const task = await taskService.patchStatus(taskId, req.body.status, req.user);
    res.json({
      success: true,
      message: `Status updated to ${req.body.status}`,
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
// Role-based protection: if auth header is passed, enforce Admin or reject; if optional, allow deletion
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }

    // If request provided user token and role is Member (not Admin), restrict deletion
    if (req.user && req.user.role && req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Only Admin users can permanently delete tasks'
      });
    }

    const result = await taskService.deleteTask(taskId, req.user);
    res.json({
      success: true,
      message: result.message,
      data: { id: result.id }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks/:id/comments
router.post('/:id/comments', optionalAuth, validate(createCommentSchema, 'body'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const comment = await taskService.addComment(taskId, req.body.user_id, req.body.comment, req.user);
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
