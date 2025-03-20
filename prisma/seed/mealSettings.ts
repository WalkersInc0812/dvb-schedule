import { Prisma, PrismaClient } from "@prisma/client";

export async function seedMealSettings(db: PrismaClient) {
  const facilities = await db.facility.findMany();

  const ranges = [
    {
      activeFromDate: "2024-08-10",
      activeToDate: "2024-08-13",
    },
    {
      activeFromDate: "2024-08-15",
      activeToDate: "2024-08-30",
    },
    {
      activeFromDate: "2024-09-10",
      activeToDate: "2024-09-13",
    },
    {
      activeFromDate: "2024-09-15",
      activeToDate: "2024-09-30",
    },
    {
      activeFromDate: "2024-10-10",
      activeToDate: "2024-10-13",
    },
    {
      activeFromDate: "2024-10-15",
      activeToDate: "2024-10-30",
    },
    {
      activeFromDate: "2024-11-10",
      activeToDate: "2024-11-13",
    },
    {
      activeFromDate: "2024-11-15",
      activeToDate: "2024-11-30",
    },
  ];

  let mealSettings: Prisma.MealSettingCreateInput[] = [];
  facilities.forEach((facility) => {
    ranges.forEach((range) => {
      mealSettings.push({
        facility: {
          connect: {
            id: facility.id,
          },
        },
        activeFromDate: range.activeFromDate,
        activeToDate: range.activeToDate,
      });
    });
  });

  for (const mealSetting of mealSettings) {
    await db.mealSetting.create({
      data: mealSetting,
    });
  }
}
