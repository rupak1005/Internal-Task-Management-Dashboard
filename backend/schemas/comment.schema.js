const Joi = require('joi');

const createCommentSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    'any.required': 'user_id is required',
    'number.base': 'user_id must be a valid user ID'
  }),
  comment: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'Comment text cannot be empty',
    'any.required': 'Comment is required'
  })
});

module.exports = {
  createCommentSchema
};
