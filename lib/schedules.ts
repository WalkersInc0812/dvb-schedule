"use server"; // TODO: 使い方合ってる？

import { Prisma } from "@prisma/client";
import { db } from "./db";
import { fromZonedTime } from "date-fns-tz";

export async function getSchedules() {
  const schedules = await db.schedule.findMany({
    where: {
      deletedAt: null,
    },
  });
  return schedules;
}

export async function getSchedulesOfThisAndNextMonth() {
  const today = new Date();
  const thisMonth = today.getMonth();
  const afterNextMonth = thisMonth + 2;
  const thisMonthFirstDay = new Date(
    today.getFullYear(),
    thisMonth,
    1,
    0,
    0,
    0,
    0
  );
  const afterNextMonthFirstDay = new Date(
    today.getFullYear(),
    afterNextMonth,
    1,
    0,
    0,
    0,
    0
  );
  const schedules = await db.schedule.findMany({
    where: {
      deletedAt: null,
      start: {
        gte: thisMonthFirstDay,
        lt: afterNextMonthFirstDay,
      },
    },
  });
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
export async function getSchedulesWithStudentAndFacilityAndSchool(options?: {
  deleted?: boolean;
}): Promise<ScheduleWithStudentAndFacilityAndSchool[]> {
  const schedules = await db.schedule.findMany({
    where: {
      deletedAt: options?.deleted ? undefined : null,
    },
    include: {
      student: {
        include: {
          facility: true,
          school: true,
        },
      },
    },
    orderBy: {
      start: "desc",
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
  const timeZone = "Asia/Tokyo";

  const gteZoned = new Date(year, month - 1, 1);
  const gte = fromZonedTime(gteZoned, timeZone);
  const ltZoned = new Date(year, month, 1);
  const lt = fromZonedTime(ltZoned, timeZone);

  const schedules = await db.schedule.findMany({
    include: {
      student: true,
    },
    where: {
      AND: [
        {
          deletedAt: null,
        },
        {
          start: {
            gte,
          },
        },
        {
          start: {
            lt,
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
      deletedAt: null,
    },
  });
  return schedules;
}

export type ScheduleWithLogsAndUser = Prisma.ScheduleGetPayload<{
  include: {
    logs: {
      include: {
        user: true;
      };
    };
  };
}>;
export async function getDeletedSchedulesWithLogsAndUserByStudentId({
  studentId,
}: {
  studentId: string;
}): Promise<ScheduleWithLogsAndUser[]> {
  const schedules = await db.schedule.findMany({
    where: {
      student: {
        id: studentId,
      },
      deletedAt: {
        not: null,
      },
    },
    include: {
      logs: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return schedules;
}

export async function getSchedulesInRecentThreeMonths() {
  const schedules = await db.schedule.findMany({
    where: {
      deletedAt: null,
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
          parents: {
            some: {
              id: parentId,
            },
          },
        },
      },
    })) !== "undefined";
  return isScheduleOwner;
}
