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

    await db.user.create({
      data: {
        name: payload.parent.name,
        email: payload.parent.email,
        role: "PARENT",
        facilities: {
          connect: {
            id: payload.facilityId,
          },
        },
        students: {
          create: {
            schoolId: payload.schoolId,
            facilityId: payload.facilityId,
            name: payload.name,
            schoolEnrollmentAcademicYear: calculateEnrollmentAcademicYear(
              payload.grade
            ),
            classes: {
              connect: {
                id: payload.classId,
              },
            },
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
