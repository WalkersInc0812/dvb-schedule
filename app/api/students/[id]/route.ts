import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { calculateEnrollmentAcademicYear } from "@/lib/students";
import { studentEditSchema } from "@/lib/validations/student";
import { z } from "zod";

export const maxDuration = 60;

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    console.time("PATCH /api/students/:id");
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    const body = await req.json();
    const payload = studentEditSchema.parse(body);

    const parent = await db.user.findFirstOrThrow({
      where: { students: { some: { id: context.params.id } } },
      include: { facilities: true },
    });

    console.time("db.$transaction");
    await db.$transaction(
      async (tx) => {
        await tx.user.update({
          where: { id: parent.id },
          data: {
            name: payload.parent.name,
            email: payload.parent.email,
            facilities: {
              set: [{ id: payload.facilityId }],
            },
          },
        });

        await tx.student.update({
          where: { id: context.params.id },
          data: {
            name: payload.name,
            schoolId: payload.schoolId,
            facilityId: payload.facilityId,
            schoolEnrollmentAcademicYear: calculateEnrollmentAcademicYear(
              payload.grade
            ),
            classes: {
              set: payload.classes.map((class_) => ({ id: class_.id })),
            },
          },
        });

        await tx.fixedUsageDayOfWeek.deleteMany({
          where: { studentId: context.params.id },
        });

        console.time("for create fixedUsageDayOfWeeks");
        const fixedUsageDayOfWeeksData = payload.fixedUsageDayOfWeeks.map(
          (fixedUsageDayOfWeek) => {
            const month = `${fixedUsageDayOfWeek.year}-${fixedUsageDayOfWeek.month}`;
            return {
              studentId: context.params.id,
              month,
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
              program3Id: fixedUsageDayOfWeek.program3?.programId,
              program3StartTime: fixedUsageDayOfWeek.program3?.startTime,
              program3EndTime: fixedUsageDayOfWeek.program3?.endTime,
            };
          }
        );

        await tx.fixedUsageDayOfWeek.createMany({
          data: fixedUsageDayOfWeeksData,
        });
        console.timeEnd("for create fixedUsageDayOfWeeks");
      },
      {
        maxWait: 2000 * 2.5 * 2,
        timeout: 10000 * 2 * 2,
      }
    );
    console.timeEnd("db.$transaction");
    console.timeEnd("PATCH /api/students/:id");

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.errors), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}

// 論地削除
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    await db.student.update({
      where: { id: context.params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
