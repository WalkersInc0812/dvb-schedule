import { PrismaClient } from "@prisma/client";
import { seedFacilities } from "./facilities";
import { seedSchools } from "./schools";
import { seedClasses } from "./classes";
import { seedStaffs } from "./staffs";
import { seedParents } from "./parents";
import { seedStudents } from "./students";
import { seedSchedules } from "./schedules";

const db = new PrismaClient();

async function main() {
  await seedFacilities(db);
  await seedSchools(db);
  await seedClasses(db);
  await seedStaffs(db);
  await seedParents(db);
  await seedStudents(db);
  await seedSchedules(db);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
