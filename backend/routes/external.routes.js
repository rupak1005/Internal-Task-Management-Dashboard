const express = require('express');
const router = express.Router();
const externalService = require('../services/external.service');

// GET /api/external/users
router.get('/users', async (req, res, next) => {
  try {
    const result = await externalService.fetchExternalUsers();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
