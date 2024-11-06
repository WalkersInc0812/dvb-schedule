import React from "react";
import DataTableSection from "./_components/data-table-section";
import { getPrograms } from "@/lib/programs";

type Props = {};

const AdminProgramPage = async (props: Props) => {
  const programs = await getPrograms();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#DC2626] bg-[#FEE2E2] border-[#FECACA] border-[1px] rounded-lg p-4 mb-[40px]">
        習い事管理
      </h1>

      <DataTableSection programs={programs} />
    </div>
  );
};

export default AdminProgramPage;
