import { db } from "@/lib/db";
import { checkIsParent, checkIsStaff, getCurrentUser } from "@/lib/session";
import { scheduleSchema } from "@/lib/validations/schedule";
import { z } from "zod";
import { fromZonedTime } from "date-fns-tz";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const body = await req.json();
    
    // Parse dates accounting for Japan Standard Time (JST)
    // When frontend sends ISO strings, they represent UTC time
    // but the user intended them to be JST, so we parse as-is 
    // since the database stores in UTC
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
      // ok
    } else {
      return new Response(null, { status: 400 });
    }

    await db.schedule.create({
      data: {
        start: payload.start,
        end: payload.end,
        meal: payload.meal,
        notes: payload.notes,
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        logs: {
          create: {
            userId: user.id,
            operation: "CREATE",
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
