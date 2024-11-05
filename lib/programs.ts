"use server";

import { Program } from "@prisma/client";
import { db } from "./db";

export const getPrograms = async (): Promise<Program[]> => {
  const programs = await db.program.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return programs;
};
