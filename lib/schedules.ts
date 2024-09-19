"use server"; // TODO: 使い方合ってる？

import { Prisma } from "@prisma/client";
import { db } from "./db";

export async function getSchedules() {
  const schedules = await db.schedule.findMany();
  return schedules;
}

// TODO: refactor
export type ScheduleWithStudentAndFacilityAndSchool =
  Prisma.ScheduleGetPayload<{
    include: {
      student: {
        include: {
          facility: true;
          school: true;
        };
      };
    };
  }>;
export async function getSchedulesWithStudentAndFacilityAndSchool(): Promise<
  ScheduleWithStudentAndFacilityAndSchool[]
> {
  const schedules = await db.schedule.findMany({
    include: {
      student: {
        include: {
          facility: true,
          school: true,
        },
      },
    },
  });
  return schedules;
}

// TODO: refactor
export type ScheduleWithStudent = Prisma.ScheduleGetPayload<{
  include: {
    student: true;
  };
}>;
export async function getSchedulesByMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<ScheduleWithStudent[]> {
  const schedules = await db.schedule.findMany({
    include: {
      student: true,
    },
    where: {
      AND: [
        {
          start: {
            gte: new Date(year, month - 1, 1),
          },
        },
        {
          start: {
            lt: new Date(year, month, 1),
          },
        },
      ],
    },
  });
  return schedules;
}

export async function getSchedulesByStudentId({
  studentId,
}: {
  studentId: string;
}) {
  const schedules = await db.schedule.findMany({
    where: {
      student: {
        id: studentId,
      },
    },
  });
  return schedules;
}

export async function getSchedulesInRecentThreeMonths() {
  const schedules = await db.schedule.findMany({
    where: {
      start: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      },
    },
  });
  return schedules;
}

export async function checkIsScheduleOwner({
  scheduleId,
  parentId,
}: {
  scheduleId: string;
  parentId: string;
}) {
  const isScheduleOwner =
    typeof (await db.schedule.findFirst({
      where: {
        id: scheduleId,
        student: {
          parentId,
        },
      },
    })) !== "undefined";
  return isScheduleOwner;
}
