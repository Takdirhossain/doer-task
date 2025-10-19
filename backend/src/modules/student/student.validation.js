const Joi = require("joi");

exports.studentSchema = Joi.object({
  username: Joi.string().min(1).max(25).required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string() .pattern(/^[0-9]{10,15}$/).min(10).max(11).required(),
  password_hash: Joi.string().min(6).max(25).required(),
  firstName: Joi.string().min(1).max(25).required(),
  lastName: Joi.string().min(1).max(25).required(),
  className: Joi.string().min(1).max(25).required(),
  rollNumber: Joi.number().required(),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().required(),
});
exports.profileUpdateSchema = Joi.object({
  firstName: Joi.string().min(1).max(25).required(),
  lastName: Joi.string().min(1).max(25).required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string() .pattern(/^[0-9]{10,15}$/).min(10).max(11).required(),
  address: Joi.string().required(),
});