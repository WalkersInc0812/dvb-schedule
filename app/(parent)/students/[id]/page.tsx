import {
  getDeletedSchedulesWithLogsAndUserByStudentId,
  getSchedulesByStudentId,
} from "@/lib/schedules";
import React from "react";
import { CalendarSection } from "./_components/calendar-section";
import { getStudentById } from "@/lib/students";
import { notFound } from "next/navigation";
import { UpcomingSection } from "./_components/upcoming-section";
import { getFacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementById } from "@/lib/facilities";
import { getFixedUsageDayOfWeeksWithProgramsByStudentId } from "@/lib/fixedUsageDayOfWeeks";
import { DeletedSection } from "./_components/deleted-section";

type Props = {
  params: Promise<{ id: string }>;
};
const CalendarPage = async ({ params }: Props) => {
  const id = (await params).id;
  const student = await getStudentById({ id });
  if (!student) {
    return notFound();
  }

  const facility =
    await getFacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementById(
      student.facilityId
    );

  const schedules = await getSchedulesByStudentId({ studentId: student.id });
  const deletedSchedules = await getDeletedSchedulesWithLogsAndUserByStudentId({
    studentId: student.id,
  });

  const fixedUsageDayOfWeeks =
    await getFixedUsageDayOfWeeksWithProgramsByStudentId(student.id);

  return (
    <>
      <div className="divide-y">
        {facility && (
          <CalendarSection
            studentId={student.id}
            facility={facility}
            schedules={schedules}
            fixedUsageDayOfWeeks={fixedUsageDayOfWeeks}
          />
        )}
        <UpcomingSection schedules={schedules} />
        {deletedSchedules.length > 0 && (
          <DeletedSection schedules={deletedSchedules} />
        )}
      </div>
    </>
  );
};

export default CalendarPage;
