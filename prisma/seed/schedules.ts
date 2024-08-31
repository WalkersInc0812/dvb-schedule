import { Prisma, PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

export async function seedSchedules(db: PrismaClient) {
  const students = await db.student.findMany();

  let schedules: Prisma.ScheduleCreateInput[] = [];
  students.forEach((student, s_i) => {
    const arrayLength = 2 * 4 * 3;
    Array.from({ length: arrayLength }).forEach((_, a_i) => {
      const start = new Date(
        2024,
        randomInt(8 - 1, 9 + 1 - 1),
        randomInt(1, 28 + 1),
        randomInt(12, 15 + 1),
        randomInt(12) * 5
      );
      const end = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        Math.max(start.getHours() + 1, randomInt(12, 22 + 1)),
        randomInt(12) * 5
      );
      schedules.push({
        student: {
          connect: {
            id: student.id,
          },
        },
        start,
        end,
        meal: [true, false][randomInt(2)],
        notes: [`備考テキスト${s_i * arrayLength + a_i + 1}`, null][
          randomInt(2)
        ],
        attendance:
          end <= new Date(2024, 9 - 1, 1) ? [true, false][randomInt(2)] : false,
      });
    });
  });

  for (const schedule of schedules) {
    await db.schedule.create({
      data: schedule,
    });
  }
}