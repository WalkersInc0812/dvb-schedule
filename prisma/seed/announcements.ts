import { Prisma, PrismaClient } from "@prisma/client";

export async function seedAnnouncements(db: PrismaClient) {
  const facilities = await db.facility.findMany();

  let announcements: Prisma.AnnouncementCreateInput[] = [];
  facilities.forEach((facility, f_i) => {
    Array.from({ length: 3 }).forEach((_, a_i) => {
      announcements.push({
        facility: {
          connect: {
            id: facility.id,
          },
        },
        content: `お知らせ${f_i + 1}-${a_i + 1}`,
        displayStartMonth: "2024-08",
        displayEndMonth: "2024-12",
      });
    });
  });

  for (const announcement of announcements) {
    await db.announcement.create({
      data: announcement,
    });
  }
}
