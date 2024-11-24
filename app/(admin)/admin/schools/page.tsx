import React from "react";
import DataTableSection from "./_components/data-table-section";
import { getSchoolsWithClasses } from "@/lib/schools";

export const dynamic = "force-dynamic";

type Props = {};

const AdminSchoolPage = async (props: Props) => {
  const schools = await getSchoolsWithClasses();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#DC2626] bg-[#FEE2E2] border-[#FECACA] border-[1px] rounded-lg p-4 mb-[40px]">
        学校管理
      </h1>

      <DataTableSection schools={schools} />
    </div>
  );
};

export default AdminSchoolPage;
