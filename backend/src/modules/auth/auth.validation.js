const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(25)
    .required()
    .messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.min": "Username must be at least 1 character",
      "string.max": "Username cannot exceed 25 characters",
      "any.required": "Username is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  mobile: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.base": "Mobile number must be a string",
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10-15 digits",
      "any.required": "Mobile number is required",
    }),

  password: Joi.string()
    .min(6)
    .max(25)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password cannot exceed 25 characters",
      "any.required": "Password is required",
    }),
});

exports.loginSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(25)
    .required()
    .messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 25 characters",
      "any.required": "Username is required",
    }),

  password: Joi.string()
    .min(6)
    .max(25)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password cannot exceed 25 characters",
      "any.required": "Password is required",
    }),
});
