import { Prisma, PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { getYear } from "date-fns";

export async function seedFixedUsageDayOfWeeks(db: PrismaClient) {
  const students = await db.student.findMany();
  const year = getYear(new Date());
  const months = Array.from({ length: 12 }).map((_, i) => i + 1);
  const daysOfWeek = [1, 2, 3, 4, 5];
  const programs = await db.program.findMany();

  let fixedUsageDayOfWeeks: Prisma.FixedUsageDayOfWeekCreateInput[] = [];
  students.forEach((student) => {
    months.forEach((month) => {
      // ランダムに1つから4つの曜日を選択
      const selectedDaysOfWeek = daysOfWeek
        .sort(() => 0.5 - Math.random())
        .slice(0, randomInt(4) + 1);
      selectedDaysOfWeek.forEach((dayOfWeek) => {
        // ランダムに1つまたは2つのプログラムを選択、ただし同じプログラムは選ばない
        const selectedPrograms = programs
          .sort(() => 0.5 - Math.random())
          .slice(0, randomInt(2) + 1);
        fixedUsageDayOfWeeks.push({
          month: `${year}-${month}`,
          dayOfWeek,
          startTime: "10:00",
          endTime: "14:00",
          needPickup: true,
          program1: {
            connect: {
              id: selectedPrograms[0].id,
            },
          },
          program1StartTime: "10:00",
          program1EndTime: "12:00",
          program2:
            selectedPrograms.length === 2
              ? {
                  connect: {
                    id: selectedPrograms[1].id,
                  },
                }
              : undefined,
          program2StartTime: selectedPrograms.length === 2 ? "12:00" : null,
          program2EndTime: selectedPrograms.length === 2 ? "14:00" : null,
          student: {
            connect: {
              id: student.id,
            },
          },
        });
      });
    });
  });

  for (const fixedUsageDayOfWeek of fixedUsageDayOfWeeks) {
    await db.fixedUsageDayOfWeek.create({
      data: fixedUsageDayOfWeek,
    });
  }
}
