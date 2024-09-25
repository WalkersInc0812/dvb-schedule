"use server";

import { Prisma } from "@prisma/client";
import { db } from "./db";

export type ScheduleLogWithUser = Prisma.ScheduleLogGetPayload<{
  include: {
    user: true;
  };
}>;
export async function getScheduleLogsByScheduleId(
  scheduleId: string
): Promise<ScheduleLogWithUser[]> {
  const scheduleLogs = await db.scheduleLog.findMany({
    where: {
      scheduleId,
    },
    include: {
      user: true,
    },
  });
  return scheduleLogs;
}
