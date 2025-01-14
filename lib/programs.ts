"use server";

import { Prisma } from "@prisma/client";
import { db } from "./db";

export type ProgramWithFixedUsageDaysCount = Prisma.ProgramGetPayload<{
  include: {
    _count: {
      select: {
        fixedUsageDaysOfWeek1: true;
        fixedUsageDaysOfWeek2: true;
        fixedUsageDaysOfWeek3: true;
      };
    };
  };
}>;
export const getPrograms = async (): Promise<
  ProgramWithFixedUsageDaysCount[]
> => {
  const programs = await db.program.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          fixedUsageDaysOfWeek1: true,
          fixedUsageDaysOfWeek2: true,
          fixedUsageDaysOfWeek3: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return programs;
};
