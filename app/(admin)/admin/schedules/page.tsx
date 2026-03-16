import { getSchedulesWithStudentAndFacilityAndSchool } from "@/lib/schedules";
import React from "react";
import DataTableSection from "./_components/data-table-section";

export const dynamic = "force-dynamic";

function getDefaultDateRange() {
  const now = new Date();
  const from = new Date(now);
  from.setMonth(now.getMonth() - 3);
  const to = new Date(now);
  to.setMonth(now.getMonth() + 3);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const AdminSchedulePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const deleted = params.deleted === "true";
  const defaultRange = getDefaultDateRange();
  const from = params.from === "null" ? undefined : typeof params.from === "string" ? params.from : defaultRange.from;
  const to = params.to === "null" ? undefined : typeof params.to === "string" ? params.to : defaultRange.to;

  const schedules = from && to ? await getSchedulesWithStudentAndFacilityAndSchool({
    deleted,
    from,
    to,
  }) : from ? await getSchedulesWithStudentAndFacilityAndSchool({
    deleted,
    from,
    to: from,
  }) : [];

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0] border-[1px] rounded-lg p-4 mb-[40px]">
        予定管理
      </h1>

      <DataTableSection schedules={schedules} dateRange={{ from, to }} />
    </div>
  );
};

export default AdminSchedulePage;
