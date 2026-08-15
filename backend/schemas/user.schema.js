const Joi = require('joi');
const { USER_ROLES } = require('../utils/constants');

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'A valid email address is required',
    'any.required': 'Email is required'
  }),
  role: Joi.string().valid(...USER_ROLES).default('Member'),
  avatar_url: Joi.string().uri().allow('', null).optional()
});

module.exports = {
  createUserSchema
};
