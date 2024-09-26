import { Prisma, PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

export async function seedSchedules(db: PrismaClient) {
  const students = await db.student.findMany();

  let schedules: Prisma.ScheduleCreateInput[] = [];
  students.forEach((student, s_i) => {
    const arrayLength = 3 * 4 * 3;
    const currentMonth = new Date().getMonth() + 1;
    Array.from({ length: arrayLength }).forEach((_, a_i) => {
      const start = new Date(
        2024,
        randomInt(currentMonth - 2 - 1, currentMonth + 1 - 1),
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

      // 土日は除外
      if (start.getDay() === 0 || start.getDay() === 6) {
        return;
      }

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
          end <= new Date(2024, currentMonth - 1, 1)
            ? [true, true, true, true, true, false][randomInt(6)]
            : false,
      });
    });
  });

  const staff = await db.user.findFirst({
    where: {
      role: "STAFF",
    },
  });
  if (!staff) {
    throw new Error("Staff not found");
  }

  // create
  for (const schedule of schedules) {
    await db.schedule.create({
      data: {
        ...schedule,
        logs: {
          create: [
            {
              userId: staff.id,
              operation: "CREATE",
            },
          ],
        },
      },
    });
  }

  const createdSchedules = await db.schedule.findMany();

  // update
  for (let i = 0; i < createdSchedules.length; i++) {
    if (i % 3 !== 0) {
      continue;
    }
    const schedule = createdSchedules[i];
    await db.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        logs: {
          create: [
            {
              userId: staff.id,
              operation: "UPDATE",
            },
          ],
        },
      },
    });
  }

  // soft delete
  for (let i = 0; i < createdSchedules.length; i++) {
    if (i % 10 !== 0) {
      continue;
    }
    const schedule = createdSchedules[i];
    await db.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        deletedAt: new Date(),
        logs: {
          create: [
            {
              userId: staff.id,
              operation: "DELETE",
            },
          ],
        },
      },
    });
  }
}
