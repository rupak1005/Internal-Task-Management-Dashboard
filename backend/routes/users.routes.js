const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { createUserSchema } = require('../schemas/user.schema');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessages = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errorMessages
    });
  }
  req.body = value;
  next();
};

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/users
router.post('/', validate(createUserSchema), async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
