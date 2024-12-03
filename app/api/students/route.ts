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
        },
      });
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
