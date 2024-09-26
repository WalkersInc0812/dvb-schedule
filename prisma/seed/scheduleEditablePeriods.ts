import { Prisma, PrismaClient } from "@prisma/client";

export async function seedScheduleEditablePeriods(db: PrismaClient) {
  const facilities = await db.facility.findMany();
  const targetMonths = ["2024-08", "2024-09", "2024-10", "2024-11", "2024-12"];
  const fromDate = "yyyy-MM-10";
  const toDate = "yyyy-MM-30";

  let periods: Prisma.ScheduleEditablePeriodCreateInput[] = [];
  facilities.forEach((facility) => {
    targetMonths.forEach((targetMonth) => {
      periods.push({
        facility: {
          connect: {
            id: facility.id,
          },
        },
        targetMonth,
        fromDate: fromDate
          .replace("yyyy", targetMonth.split("-")[0])
          .replace(
            "MM",
            (Number(targetMonth.split("-")[1]) - 1).toString().padStart(2, "0")
          ),
        toDate: toDate
          .replace("yyyy", targetMonth.split("-")[0])
          .replace(
            "MM",
            (Number(targetMonth.split("-")[1]) - 1).toString().padStart(2, "0")
          ),
      });
    });
  });

  for (const period of periods) {
    await db.scheduleEditablePeriod.create({
      data: period,
    });
  }
}
