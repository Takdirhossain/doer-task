const { prisma } = require("../../config/database");
const AppError = require("../../utils/AppError");

exports.createRole = async (data) => {
  const result = await prisma.role.create({
    data,
  });
  return result;
};
exports.getRoles = async () => {
  const result = await prisma.role.findMany();
  return result;
};
exports.updateRole = async (id, data) => {
  const result = await prisma.role.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

exports.createPermission = async (data) => {
  const result = await prisma.permission.create({
    data,
  });
  return result;
};

exports.getPermissions = async () => {
  const result = await prisma.permission.findMany();
  return result;
};

exports.updatePermission = async (id, data) => {
  const result = await prisma.permission.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

exports.deletePermission = async (id) => {
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new AppError("Permission not found", 404);
    }

    const deleted = await prisma.permission.delete({
      where: { id },
    });

    return deleted;
};
exports.createRolePermission = async (data) => {
  const existing = await prisma.rolePermission.findUnique({
    where: {
      roleId_permissionId: {
        roleId: data.roleId,
        permissionId: data.permissionId,
      },
    },
  });

  if (existing) {
    throw new AppError("This Role already has the specified Permission", 400);
  }

  const rolePermission = await prisma.rolePermission.create({
    data: {
      roleId: data.roleId,
      permissionId: data.permissionId,
    },
  });

  return rolePermission;
};

exports.getRolePermissions = async () => {
  const result = await prisma.rolePermission.findMany({
    include: {
      role: true,
      permission: true,
    },
  });
  return result;
};
exports.updateRolePermission = async (id, data) => {
   const existingRecord = await prisma.rolePermission.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new AppError("RolePermission record not found", 404);
    }

    const duplicate = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: data.roleId,
          permissionId: data.permissionId,
        },
      },
    });

    if (duplicate && duplicate.id !== id) {
      throw new AppError("This Role already has the specified Permission", 400);
    }

    const updated = await prisma.rolePermission.update({
      where: { id },
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
      },
    });

    return updated;
};

exports.deleteRolePermission = async (id) => {
    const existingPermission = await prisma.rolePermission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      throw new AppError("Permission not found", 404);
    }

    const deleted = await prisma.rolePermission.delete({
      where: { id },
    });

    return deleted;
};

exports.checkRolePermission = async (value) => {
  const rolePermission = await prisma.rolePermission.findFirst({
    where: {
      roleId: value.role,
      permission: {
        name: value.permissionName,
        module: value.moduleName
      }
    }
  });

  return !!rolePermission;
};