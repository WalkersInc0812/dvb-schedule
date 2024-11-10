"use server"; // TODO: 使い方あってる？

import { Prisma } from "@prisma/client";
import { db } from "./db";

export type FixedUsageDayOfWeekWithPrograms =
  Prisma.FixedUsageDayOfWeekGetPayload<{
    include: {
      program1: true;
      program2: true;
    };
  }>;

// TODO: improve performance
export async function getFixedUsageDayOfWeeksWithProgramsByStudentId(
  studentId: string
): Promise<FixedUsageDayOfWeekWithPrograms[]> {
  const fixedUsageDayOfWeeks = await db.fixedUsageDayOfWeek.findMany({
    where: {
      studentId,
    },
    include: {
      program1: true,
      program2: true,
    },
  });

  return fixedUsageDayOfWeeks;
}
