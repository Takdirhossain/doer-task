const express = require("express");
const router = express.Router();
const { createRole, getRoles, updateRole, createPermission, getPermissions, updatePermission, createRolePermission, getRolePermissions, updateRolePermission, deletePermission, deleteRolePermission } = require("./authorization.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/create-role", auth, createRole);
router.get("/get-roles", getRoles);
router.put("/update-role/:id", auth, updateRole);

router.post("/create-permission", auth,  createPermission);
router.get("/get-permissions", auth, getPermissions);
router.put("/update-permission/:id", auth,  updatePermission);
router.delete("/delete-permission/:id", auth, deletePermission);

router.post("/create-role-permission", auth, createRolePermission);
router.get("/get-role-permissions", auth, getRolePermissions);
router.put("/update-role-permission/:id", auth, updateRolePermission);
router.delete("/delete-role-permission/:id", auth, deleteRolePermission);

module.exports = router;
