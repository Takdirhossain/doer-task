const express = require("express");
const router = express.Router();
const { createRole, getRoles, updateRole, createPermission, getPermissions, updatePermission, createRolePermission, getRolePermissions, updateRolePermission, deletePermission, deleteRolePermission } = require("./authorization.controller");
const validateBody = require("../../middleware/validaion.middleware");
const { roleSchema, permissionSchema, rolePermissionSchema } = require("./authorization.validation");

router.post("/create-role", validateBody(roleSchema), createRole);
router.get("/get-roles", getRoles);
router.put("/update-role/:id", validateBody(roleSchema), updateRole);

router.post("/create-permission", validateBody(permissionSchema), createPermission);
router.get("/get-permissions", getPermissions);
router.put("/update-permission/:id", validateBody(permissionSchema), updatePermission);
router.delete("/delete-permission/:id", deletePermission);

router.post("/create-role-permission", validateBody(rolePermissionSchema), createRolePermission);
router.get("/get-role-permissions", getRolePermissions);
router.put("/update-role-permission/:id", validateBody(rolePermissionSchema), updateRolePermission);
router.delete("/delete-role-permission/:id", deleteRolePermission);

module.exports = router;
