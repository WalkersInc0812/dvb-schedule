import { getSchedulesByStudentId } from "@/lib/schedules";
import React from "react";
import { CalendarSection } from "./_components/calendar-section";
import { getCurrentUser } from "@/lib/session";
import { getStudentsByParentId } from "@/lib/students";
import { notFound } from "next/navigation";
import { UpcomingSection } from "./_components/upcoming-section";

type Props = {};
const CalendarPage = async (props: Props) => {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  const students = await getStudentsByParentId({ parentId: user.id });
  if (students.length === 0) {
    return notFound();
  }

  const student = students[0]; // TODO: 複数studentsに対応できるようにする
  const schedules = await getSchedulesByStudentId({ studentId: student.id });

  return (
    <>
      <div className="divide-y">
        <CalendarSection studentId={student.id} schedules={schedules} />
        <UpcomingSection schedules={schedules} />
      </div>
    </>
  );
};

export default CalendarPage;
