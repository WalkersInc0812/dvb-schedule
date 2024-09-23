import { Prisma } from "@prisma/client";
import { db } from "./db";

export type FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement =
  Prisma.FacilityGetPayload<{
    include: {
      mealSettings: true;
      scheduleEditablePeriods: true;
      announcements: true;
    };
  }>;
export async function getfacilitiesWithMealSettingAndScheduleEditablePeriodAndAnnouncement(): Promise<
  FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement[]
> {
  // TODO: 全てのデータを取得するのはパフォーマンスに影響あるので、改善する

  const facilities = await db.facility.findMany({
    include: {
      mealSettings: true,
      scheduleEditablePeriods: true,
      announcements: true,
    },
  });

  return facilities;
}
