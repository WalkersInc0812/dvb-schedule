import { Prisma, PrismaClient } from "@prisma/client";

export async function seedPrograms(db: PrismaClient) {
  const programs: Prisma.ProgramCreateInput[] = [
    {
      name: "英語",
    },
    {
      name: "コ・ラボ",
    },
    {
      name: "プログラミング初級",
      shortName: "P初級",
    },
  ];

  for (const program of programs) {
    await db.program.create({
      data: program,
    });
  }
}
