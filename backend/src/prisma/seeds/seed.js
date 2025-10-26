const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PERMISSIONS = {
  STUDENT: {
    PROCESS_CSV: ["TEACHER"],
    SAVE_CSV: ["TEACHER"],
    STUDENT_LIST: ["TEACHER"],
    STUDENT_BY_ID: ["TEACHER", "STUDENT"],
    PROFILE_UPDATE: ["TEACHER", "STUDENT"],
    CREATE_STUDENT: ["TEACHER"],
    UPDATE_STUDENT: ["TEACHER", "STUDENT"],
    DELETE: ["TEACHER"],
    EXPORT_LIST: ["TEACHER"]
  },
  LOG: {
    GET_LOGIN_LOG: ["TEACHER", "STUDENT"],
    GET_SYSTEM_LOG: ["TEACHER"]
  },
  ATTENDANCE: {
    PRESENT: ["STUDENT"],
    GET_TODAY_ATTENDANCE: ["TEACHER"],
    GET_STUDENT_YEARLY_STATS: ["STUDENT"],
    GET_PRESENT_HISTORY: ["STUDENT"]
  }
};

async function main() {
  console.log("🔹 Seeding started...");

  // ✅ Step 1: Create Roles
  console.log("⏳ Creating Roles...");
  const roles = {};
  for (const roleName of ["TEACHER", "STUDENT"]) {
    roles[roleName] = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }
  console.log("✅ Roles Created");

  // ✅ Step 2: Create Permissions
  console.log("⏳ Creating Permissions...");
  const permissions = {};
  for (const moduleName in PERMISSIONS) {
    for (const permissionName in PERMISSIONS[moduleName]) {
      const permission = await prisma.permission.upsert({
        where: {
          name_module: { name: permissionName, module: moduleName }
        },
        update: {},
        create: {
          name: permissionName,
          module: moduleName
        }
      });

      permissions[`${moduleName}_${permissionName}`] = permission;
    }
  }
  console.log("✅ Permissions Created");

  // ✅ Step 3: Assign Permissions to Roles
  console.log("⏳ Applying Permissions to Roles...");
  for (const moduleName in PERMISSIONS) {
    for (const [permissionName, allowedRoles] of Object.entries(
      PERMISSIONS[moduleName]
    )) {
      const permission = permissions[`${moduleName}_${permissionName}`];

      for (const roleName of allowedRoles) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roles[roleName].id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: roles[roleName].id,
            permissionId: permission.id
          }
        });
      }
    }
  }
  console.log("✅ Permissions Successfully Assigned to Roles");

  console.log("🎉 Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeder Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
