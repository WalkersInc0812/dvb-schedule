import { getSchedulesWithStudentAndFacilityAndSchool } from "@/lib/schedules";
import React from "react";
import DataTableSection from "./_components/data-table-section";

type Props = {};

const AdminSchedulePage = async (props: Props) => {
  const schedules = await getSchedulesWithStudentAndFacilityAndSchool();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0] border-[1px] rounded-lg p-4 mb-[40px]">
        予定管理
      </h1>

      <DataTableSection schedules={schedules} />
    </div>
  );
};

export default AdminSchedulePage;
