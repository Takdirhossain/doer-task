const Joi = require("joi");

exports.roleSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z]+(_[A-Za-z]+)*$/)
    .trim()
    .required()
    .messages({
      "string.base": `Role Name must be a string`,
      "string.empty": `Role Name is required`,
      "any.required": `Role Name is required`,
      "string.pattern.base": `Role Name can only contain letters and underscores, e.g. ADMIN_ROLE`,
    })
    .custom((value, helpers) => value.toUpperCase(), "Uppercase conversion"),
});
exports.permissionSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z]+(_[A-Za-z]+)*$/)
    .trim()
    .required()
    .messages({
      "string.base": `Permission Name must be a string`,
      "string.empty": `Permission Name is required`,
      "any.required": `Permission Name is required`,
      "string.pattern.base": `Permission Name can only contain letters and underscores, e.g. CREATE_USER`,
    })
    .custom((value, helpers) => value.toUpperCase(), "Uppercase conversion"),

  module: Joi.string()
    .pattern(/^[A-Za-z]+(_[A-Za-z]+)*$/)
    .trim()
    .required()
    .messages({
      "string.base": `Module Name must be a string`,
      "string.empty": `Module Name is required`,
      "any.required": `Module Name is required`,
      "string.pattern.base": `Module Name can only contain letters and underscores, e.g. USER_MANAGEMENT`,
    })
    .custom((value, helpers) => value.toUpperCase(), "Uppercase conversion"),
})
  .required()
  .messages({
    "object.base": "Payload must be an object",
    "any.required": "Payload is required",
  });

  exports.rolePermissionSchema = Joi.object({
  roleId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": `Role ID must be a string`,
      "string.empty": `Role ID is required`,
      "any.required": `Role ID is required`,
    }),

  permissionId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": `Permission ID must be a string`,
      "string.empty": `Permission ID is required`,
      "any.required": `Permission ID is required`,
    }),
})
  .required()
  .messages({
    "object.base": "Payload must be an object",
    "any.required": "Payload is required",
  });

exports.roleIdParamSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "string.base": "Role ID must be a string",
    "string.empty": "Role ID is required",
    "any.required": "Role ID is required",
  }),
});

exports.checkPermissionSchema = Joi.object({
    userId: Joi.string().trim().required().messages({
      "string.base": "User ID must be a string",
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),
    permissionName: Joi.string().trim().required().messages({
      "string.base": "Permission Name must be a string",
      "string.empty": "Permission Name is required",
      "any.required": "Permission Name is required",
    }),
    moduleName: Joi.string().trim().required().messages({
      "string.base": "Module Name must be a string",
      "string.empty": "Module Name is required",
      "any.required": "Module Name is required",
    }),
  })