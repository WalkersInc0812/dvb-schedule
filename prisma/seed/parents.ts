import { Prisma, PrismaClient } from "@prisma/client";

export async function seedParents(db: PrismaClient) {
  const facilities = await db.facility.findMany();

  let parents: Prisma.UserCreateInput[] = [];
  facilities.forEach((facility, f_i) => {
    const arrayLength = 30;
    Array.from({ length: arrayLength }).forEach((_, a_i) => {
      parents.push({
        name: `保護者${f_i * arrayLength + a_i + 1}`,
        email: `parent${f_i * arrayLength + a_i + 1}@example.com`,
        role: "PARENT",
        facilities: {
          connect: {
            id: facility.id,
          },
        },
      });
    });
  });

  for (const parent of parents) {
    await db.user.create({
      data: parent,
    });
  }
}
