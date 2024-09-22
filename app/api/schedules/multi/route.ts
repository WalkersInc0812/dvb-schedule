import { db } from "@/lib/db";
import { checkIsParent, checkIsStaff, getCurrentUser } from "@/lib/session";
import {
  scheduleMultiCreateSchema,
  scheduleMultiUpdateSchema,
} from "@/lib/validations/schedule";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const body = await req.json();
    const payload = scheduleMultiCreateSchema.parse({
      ...body,
      dates: body.dates.map((date: any) => ({
        start: new Date(date.start),
        end: new Date(date.end),
      })),
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

    await db.schedule.createMany({
      data: payload.dates.map((date) => ({
        start: date.start,
        end: date.end,
        meal: payload.meal,
        attendance: payload.attendance,
        notes: payload.notes,
        studentId: payload.studentId,
      })),
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const body = await req.json();
    const payload = scheduleMultiUpdateSchema.parse({
      ...body,
      start: new Date(body.start),
    });

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    await db.schedule.updateMany({
      where: {
        id: {
          in: payload.ids,
        },
      },
      data: {
        start: payload.start,
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
