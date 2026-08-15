const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboard.service');

// GET /api/dashboard
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.user_id ? Number(req.query.user_id) : null;
    const data = await dashboardService.getMetrics(userId);
    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
