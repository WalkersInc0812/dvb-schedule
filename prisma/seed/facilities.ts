import { Prisma, PrismaClient } from "@prisma/client";

export async function seedFacilities(db: PrismaClient) {
  const facilities: Prisma.FacilityCreateInput[] = Array.from({
    length: 3,
  }).map((_, i) => ({
    name: `教室${i + 1}`,
  }));

  for (const facility of facilities) {
    await db.facility.create({
      data: facility,
    });
  }
}
