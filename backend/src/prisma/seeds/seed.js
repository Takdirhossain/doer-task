import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "TEACHER" },
      { name: "STUDENT" }
    ]
  });

  await prisma.permission.createMany({
    data: [
      { name: "CREATE_USER", module: "USER" },
      { name: "EDIT_USER", module: "USER" },
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
