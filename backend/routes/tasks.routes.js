const express = require('express');
const router = express.Router();
const taskService = require('../services/task.service');
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

// POST /api/tasks
router.post('/', validate(createTaskSchema, 'body'), async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
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
router.put('/:id', validate(updateTaskSchema, 'body'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const task = await taskService.updateTask(taskId, req.body);
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
router.patch('/:id/status', validate(patchStatusSchema, 'body'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const task = await taskService.patchStatus(taskId, req.body.status);
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
router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const result = await taskService.deleteTask(taskId);
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
router.post('/:id/comments', validate(createCommentSchema, 'body'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }
    const comment = await taskService.addComment(taskId, req.body.user_id, req.body.comment);
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
