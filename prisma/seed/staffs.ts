import { Prisma, PrismaClient } from "@prisma/client";

export async function seedStaffs(db: PrismaClient) {
  const facilities = await db.facility.findMany();

  let staffs: Prisma.UserCreateInput[] = [];
  facilities.forEach((facility, f_i) => {
    const arrayLength = 3;
    Array.from({ length: arrayLength }).forEach((_, a_i) => {
      staffs.push({
        name: `職員${f_i * arrayLength + a_i + 1}`,
        email: `staff${f_i * arrayLength + a_i + 1}@example.com`,
        role: "STAFF",
        facilities: {
          connect: {
            id: facility.id,
          },
        },
      });
    });
  });

  for (const staff of staffs) {
    await db.user.create({
      data: staff,
    });
  }
}
