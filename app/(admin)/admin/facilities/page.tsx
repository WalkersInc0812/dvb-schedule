import { getFacilities } from "@/lib/facilities";
import React from "react";
import { DataTableSection } from "./_components/data-table-section";

type Props = {};

const AdminFacilityPage = async (props: Props) => {
  const facilities = await getFacilities();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#000] bg-[#F4F4F4] border-[#E0E0E0] border-[1px] rounded-lg p-4 mb-[40px]">
        教室管理
      </h1>

      <DataTableSection facilities={facilities} />
    </div>
  );
};

export default AdminFacilityPage;
