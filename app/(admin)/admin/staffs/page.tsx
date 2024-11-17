import { getStaffs } from "@/lib/staffs";
import React from "react";
import DataTableSection from "./_components/data-table-section";

export const dynamic = "force-dynamic";

const Page = async () => {
  const staffs = await getStaffs();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#000] bg-[#F4F4F4] border-[#E0E0E0] border-[1px] rounded-lg p-4 mb-[40px]">
        職員管理
      </h1>

      <DataTableSection staffs={staffs} />
    </div>
  );
};

export default Page;
