import { db } from "@/lib/db";
import { getFacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementById } from "@/lib/facilities";
import { checkIsParent, checkIsStaff, getCurrentUser } from "@/lib/session";
import { getStudentById } from "@/lib/students";
import {
  scheduleMultiCreateSchema,
  scheduleMultiUpdateSchema,
} from "@/lib/validations/schedule";
import { parse } from "date-fns";
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

    const student = await getStudentById({ id: payload.studentId });
    if (!student) {
      return new Response(null, { status: 404 });
    }

    const facility =
      await getFacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementById(
        student.facilityId
      );
    if (!facility) {
      return new Response(null, { status: 404 });
    }

    await db.$transaction(
      payload.dates.map((date) =>
        db.schedule.create({
          data: {
            start: date.start,
            end: date.end,
            // TODO: 境界値のチェック
            // TODO: timezoneのチェック
            meal:
              payload.meal &&
              facility.mealSettings.some(
                (s) =>
                  parse(s.activeFromDate, "yyyy-MM-dd", new Date()) <=
                    date.start &&
                  date.start <= parse(s.activeToDate, "yyyy-MM-dd", new Date())
              ),
            attendance: payload.attendance,
            notes: payload.notes,
            studentId: payload.studentId,
            logs: {
              create: {
                userId: user.id,
                operation: "CREATE",
              },
            },
          },
        })
      )
    );

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

/**
 * スタッフのみ更新できる
 * 開始日時のみ更新できる
 */
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

    await db.$transaction(
      payload.ids.map((id) =>
        db.schedule.update({
          where: {
            id,
          },
          data: {
            start: payload.start,
            logs: {
              create: {
                userId: user.id,
                operation: "UPDATE",
              },
            },
          },
        })
      )
    );

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
