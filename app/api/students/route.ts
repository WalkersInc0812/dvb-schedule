import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { calculateEnrollmentAcademicYear } from "@/lib/students";
import { studentCreateSchema } from "@/lib/validations/student";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    const body = await req.json();
    const payload = studentCreateSchema.parse(body);

    await db.$transaction(async (tx) => {
      const createdParent = await tx.user.create({
        data: {
          name: payload.parent.name,
          email: payload.parent.email,
          role: "PARENT",
          facilities: {
            connect: {
              id: payload.facilityId,
            },
          },
        },
      });

      const createdStudent = await tx.student.create({
        data: {
          parentId: createdParent.id,
          name: payload.name,
          schoolId: payload.schoolId,
          facilityId: payload.facilityId,
          schoolEnrollmentAcademicYear: calculateEnrollmentAcademicYear(
            payload.grade
          ),
          classes: {
            connect: {
              id: payload.classId,
            },
          },
        },
      });

      for (let i = 0; i < payload.fixedUsageDayOfWeeks.length; i++) {
        const fixedUsageDayOfWeek = payload.fixedUsageDayOfWeeks[i];
        const [year, term] = fixedUsageDayOfWeek.term.split("-");
        const months =
          term === "1"
            ? ["04", "05", "06", "07"]
            : term === "2"
            ? ["08", "09", "10", "11", "12"]
            : term === "3"
            ? ["01", "02", "03"]
            : [];
        for (let j = 0; j < months.length; j++) {
          const month = months[j];
          await tx.fixedUsageDayOfWeek.create({
            data: {
              month: `${year}-${month}`,
              dayOfWeek: fixedUsageDayOfWeek.dayOfWeek,
              startTime: fixedUsageDayOfWeek.startTime,
              endTime: fixedUsageDayOfWeek.endTime,
              needPickup: fixedUsageDayOfWeek.needPickup,
              program1Id: fixedUsageDayOfWeek.program1?.programId,
              program1StartTime: fixedUsageDayOfWeek.program1?.startTime,
              program1EndTime: fixedUsageDayOfWeek.program1?.endTime,
              program2Id: fixedUsageDayOfWeek.program2?.programId,
              program2StartTime: fixedUsageDayOfWeek.program2?.startTime,
              program2EndTime: fixedUsageDayOfWeek.program2?.endTime,
              studentId: createdStudent.id,
            },
          });
        }
      }
    });

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.errors), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}
