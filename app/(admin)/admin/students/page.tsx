import { getStudents } from "@/lib/students";
import React from "react";
import DataTableSection from "./_components/data-table-section";

type Props = {};

const AdminStudentPage = async (props: Props) => {
  const students = await getStudents();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#1D4ED8] bg-[#DBEAFE] border-[#BFDBFE] border-[1px] rounded-lg p-4 mb-[40px]">
        利用者管理
      </h1>

      <DataTableSection students={students} />
    </div>
  );
};

export default AdminStudentPage;
