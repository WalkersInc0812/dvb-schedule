import { db } from "@/lib/db";
import { checkIsParent, checkIsStaff, getCurrentUser } from "@/lib/session";
import { scheduleSchema } from "@/lib/validations/schedule";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const body = await req.json();
    const payload = scheduleSchema.parse({
      ...body,
      start: new Date(body.start),
      end: new Date(body.end),
    });

    const isStaff = await checkIsStaff();
    const isParent = await checkIsParent();
    if (isStaff) {
      // ok
    } else if (isParent) {
      const isStudentParent =
        typeof (await db.student.findFirst({
          where: {
            id: payload.studentId,
            parentId: user.id,
          },
        })) !== "undefined";
      if (!isStudentParent) {
        return new Response(null, { status: 400 });
      }
    }

    await db.schedule.create({
      data: {
        start: payload.start,
        end: payload.end,
        meal: payload.meal,
        attendance: payload.attendance,
        notes: payload.notes,
        student: {
          connect: {
            id: payload.studentId,
          },
        },
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
