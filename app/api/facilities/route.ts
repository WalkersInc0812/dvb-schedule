import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { facilityCreateSchema } from "@/lib/validations/facility";
import { Prisma } from "@prisma/client";
import { addYears, format, setDate, setMonth, subMonths } from "date-fns";
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
    const payload = facilityCreateSchema.parse(body);

    // scheduleEditablePeriods を 100年分作成する
    const scheduleEditablePeriods: Prisma.ScheduleEditablePeriodCreateManyFacilityInput[] =
      [];
    for (let yearI = 0; yearI < 100; yearI++) {
      for (let monthI = 0; monthI < 12; monthI++) {
        const now = new Date();
        const targetMonth = setMonth(addYears(now, yearI), monthI);
        const editableMonth = subMonths(targetMonth, 1);
        const fromDate = setDate(editableMonth, 10);
        const toDate = setDate(editableMonth, 25);

        scheduleEditablePeriods.push({
          targetMonth: format(targetMonth, "yyyy-MM"),
          fromDate: format(fromDate, "yyyy-MM-dd"),
          toDate: format(toDate, "yyyy-MM-dd"),
        });
      }
    }

    await db.facility.create({
      data: {
        name: payload.name,
        scheduleEditablePeriods: {
          createMany: {
            data: scheduleEditablePeriods,
          },
        },
      },
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
