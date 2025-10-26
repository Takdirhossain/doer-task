const Joi = require("joi");


exports.studentSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(25)
    .required()
    .messages({
      'string.base': 'Username must be a string',
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 1 character',
      'string.max': 'Username cannot exceed 25 characters',
      'any.required': 'Username is required',
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must contain only digits and be 10 to 15 digits long',
      'string.min': 'Mobile number must be at least 10 digits',
      'string.max': 'Mobile number cannot exceed 15 digits',
      'any.required': 'Mobile number is required',
    }),
  
  password_hash: Joi.string()
    .min(6)
    .max(25)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password cannot exceed 25 characters',
      'any.required': 'Password is required',
    }),
  
  firstName: Joi.string()
    .min(1)
    .max(25)
    .required()
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name cannot exceed 25 characters',
      'any.required': 'First name is required',
    }),
  
  lastName: Joi.string()
    .min(1)
    .max(25)
    .required()
    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name cannot exceed 25 characters',
      'any.required': 'Last name is required',
    }),
  
  class: Joi.number()
    .min(1)
    .max(12)
    .required()
    .messages({
      'number.base': 'Class must be a number',
      'number.min': 'Class must be at least 1',
      'number.max': 'Class cannot exceed 12',
      'any.required': 'Class is required',
    }),
  
  rollNumber: Joi.number()
    .required()
    .messages({
      'number.base': 'Roll number must be a number',
      'any.required': 'Roll number is required',
    }),
  
  dateOfBirth: Joi.date()
    .required()
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'any.required': 'Date of birth is required',
    }),
  
  address: Joi.string()
    .required()
    .messages({
      'string.base': 'Address must be a string',
      'string.empty': 'Address is required',
      'any.required': 'Address is required',
    }),
    role: Joi.string().required().messages({
      'string.base': 'Role must be a string',
      'string.empty': 'Role is required',
      'any.required': 'Role is required',
    }),
});

exports.profileUpdateSchema = Joi.object({
  firstName: Joi.string()
    .min(1)
    .max(25)
    .required()
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name cannot exceed 25 characters',
      'any.required': 'First name is required',
    }),
  
  lastName: Joi.string()
    .min(1)
    .max(25)
    .required()
    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name cannot exceed 25 characters',
      'any.required': 'Last name is required',
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must contain only digits and be 10 to 15 digits long',
      'string.min': 'Mobile number must be at least 10 digits',
      'string.max': 'Mobile number cannot exceed 15 digits',
      'any.required': 'Mobile number is required',
    }),
  
  address: Joi.string()
    .required()
    .messages({
      'string.base': 'Address must be a string',
      'string.empty': 'Address is required',
      'any.required': 'Address is required',
    }),
});

exports.studentUpdateSchema = Joi.object({
  rollNumber: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Roll number must be a number',
      'number.min': 'Roll number must be at least 1',
      'any.required': 'Roll number is required',
    }),
  
  firstName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must be less than 100 characters',
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must be less than 100 characters',
    }),

  address: Joi.string()
    .allow(null, '')
    .max(255)
    .messages({
      'string.max': 'Address must be less than 255 characters',
    }),

  class: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .allow(null)
    .messages({
      'number.base': 'Class must be a number',
      'number.min': 'Class must be at least 1',
      'number.max': 'Class cannot exceed 12',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email',
      'any.required': 'Email is required',
    }),

  mobile: Joi.string()
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be 11 digits',
      'any.required': 'Mobile number is required',
    }),

  status: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Status must be true or false',
      'any.required': 'Status is required',
    }),

  userId: Joi.string()
    .required()
    .messages({
      'any.required': 'User ID is required',
    }),
    id: Joi.string(),
});

exports.studentIdParamSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'Student ID must be a string',
      'string.empty': 'Student ID is required',
      'any.required': 'Student ID is required',
    }),
}); 