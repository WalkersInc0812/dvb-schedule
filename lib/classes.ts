"use server";

import { db } from "./db";

export const searchClasses = async ({
  schoolId,
  academicYear,
  grade,
}: {
  schoolId: string;
  academicYear: number;
  grade: number;
}) => {
  const classes = await db.class.findMany({
    where: {
      schoolId,
      academicYear,
      grade,
    },
    orderBy: {
      name: "asc",
    },
  });

  return classes;
};
