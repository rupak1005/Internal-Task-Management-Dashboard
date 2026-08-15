const express = require('express');
const router = express.Router();
const auditService = require('../services/audit.service');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * GET /api/audit-logs
 * Protected - Admin role required
 */
router.get('/', authenticateToken, requireRole('Admin'), async (req, res, next) => {
  try {
    const { page, limit, action, user_id } = req.query;
    const result = await auditService.getAllLogs({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      action,
      userId: user_id ? parseInt(user_id, 10) : undefined,
    });
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
