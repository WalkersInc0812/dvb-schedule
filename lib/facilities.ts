import { Facility, Prisma } from "@prisma/client";
import { db } from "./db";

export async function getFacilities(): Promise<Facility[]> {
  const facilities = await db.facility.findMany({
    where: {
      deletedAt: null,
    },
  });

  return facilities;
}

export type FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount =
  Prisma.FacilityGetPayload<{
    include: {
      mealSettings: true;
      scheduleEditablePeriods: true;
      announcements: true;
      _count: {
        select: {
          students: true;
        };
      };
    };
  }>;

export async function getFacilitiesWithMealSettingAndScheduleEditablePeriodAndAnnouncement(): Promise<
  FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount[]
> {
  // TODO: 全てのデータを取得するのはパフォーマンスに影響あるので、改善する

  const facilities = await db.facility.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      mealSettings: true,
      scheduleEditablePeriods: true,
      announcements: true,
      _count: {
        select: {
          students: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return facilities;
}

export type FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement =
  Prisma.FacilityGetPayload<{
    include: {
      mealSettings: true;
      scheduleEditablePeriods: true;
      announcements: true;
    };
  }>;
export async function getFacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementById(
  id: string
): Promise<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement | null> {
  const facility = await db.facility.findUnique({
    where: { id },
    include: {
      mealSettings: true,
      scheduleEditablePeriods: true,
      announcements: true,
    },
  });

  return facility;
}
