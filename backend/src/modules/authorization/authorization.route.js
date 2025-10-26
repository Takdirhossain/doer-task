const express = require("express");
const router = express.Router();
const { createRole, getRoles, updateRole, createPermission, getPermissions, updatePermission, createRolePermission, getRolePermissions, updateRolePermission, deletePermission, deleteRolePermission } = require("./authorization.controller");

router.post("/create-role", createRole);
router.get("/get-roles", getRoles);
router.put("/update-role/:id",  updateRole);

router.post("/create-permission",  createPermission);
router.get("/get-permissions", getPermissions);
router.put("/update-permission/:id",  updatePermission);
router.delete("/delete-permission/:id", deletePermission);

router.post("/create-role-permission", createRolePermission);
router.get("/get-role-permissions", getRolePermissions);
router.put("/update-role-permission/:id", updateRolePermission);
router.delete("/delete-role-permission/:id", deleteRolePermission);

module.exports = router;
