const apiResponse = require("../../utils/apiResponse");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const service = require("./authorization.service");
const { roleSchema, permissionSchema, rolePermissionSchema, checkPermissionSchema } = require("./authorization.validation");

exports.createRole = catchAsync(async (req, res, next) => {
  const { error, value } = roleSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const result = await service.createRole(value);
 res.json(apiResponse(true, "Role created successfully", result));
});

exports.getRoles = catchAsync(async (req, res, next) => {
  const result = await service.getRoles();
  res.json(apiResponse(true, "Roles fetched successfully", result));
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const { error, value } = roleSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const result = await service.updateRole(req.params.id, value);
  res.json(apiResponse(true, "Role updated successfully", result));
});

exports.createPermission = catchAsync(async (req, res, next) => {
  const { error, value } = permissionSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const result = await service.createPermission(value);
  res.json(apiResponse(true, "Permission created successfully", result));
});

exports.getPermissions = catchAsync(async (req, res, next) => {
  const result = await service.getPermissions();
  res.json(apiResponse(true, "Permissions fetched successfully", result));
});

exports.updatePermission = catchAsync(async (req, res, next) => {
  const { error, value } = permissionSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const result = await service.updatePermission(req.params.id, value);
  res.json(apiResponse(true, "Permission updated successfully", result));
});

exports.deletePermission = catchAsync(async (req, res, next) => {
  const result = await service.deletePermission(req.params.id);
  res.json(apiResponse(true, "Permission deleted successfully", result));
});

exports.createRolePermission = catchAsync(async (req, res, next) => {
  const { error, value } = rolePermissionSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const result = await service.createRolePermission(value);
  res.json(apiResponse(true, "Role Permission created successfully", result));
});

exports.getRolePermissions = catchAsync(async (req, res, next) => {
  const result = await service.getRolePermissions();
  res.json(apiResponse(true, "Role Permissions fetched successfully", result));
});

exports.updateRolePermission = catchAsync(async (req, res, next) => {
  const { error, value } = rolePermissionSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const result = await service.updateRolePermission(req.params.id, value);
  res.json(apiResponse(true, "Role Permission updated successfully", result));
});
exports.deleteRolePermission = catchAsync(async (req, res, next) => {
  const result = await service.deleteRolePermission(req.params.id);
  res.json(apiResponse(true, "Role Permission deleted successfully", result));
});
