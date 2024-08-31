import { PrismaClient, Prisma } from "@prisma/client";

export async function seedSchools(db: PrismaClient) {
  const schools: Prisma.SchoolCreateInput[] = Array.from({ length: 9 }).map(
    (_, i) => ({
      name: `学校${i + 1}`,
    })
  );

  for (const school of schools) {
    await db.school.create({
      data: school,
    });
  }
}
