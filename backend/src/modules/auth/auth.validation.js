const Joi = require("joi");

exports.registerSchema = Joi.object({
    username: Joi.string().min(1).max(25).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10,15}$/).min(10).max(11).required(),
    password: Joi.string().min(6).max(25).required(),
  });
  
  exports.loginSchema = Joi.object({
    username: Joi.string().min(3).max(25).required(),
    password: Joi.string().min(6).max(25).required()
  });