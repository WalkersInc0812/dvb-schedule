import { getStudents } from "@/lib/students";
import React from "react";
import DataTableSection from "./_components/data-table-section";
import { getFacilities } from "@/lib/facilities";
import { getSchools } from "@/lib/schools";

type Props = {};

const AdminStudentPage = async (props: Props) => {
  const students = await getStudents();
  const facilities = await getFacilities();
  const schools = await getSchools();

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#1D4ED8] bg-[#DBEAFE] border-[#BFDBFE] border-[1px] rounded-lg p-4 mb-[40px]">
        利用者管理
      </h1>

      <DataTableSection
        students={students}
        facilities={facilities}
        schools={schools}
      />
    </div>
  );
};

export default AdminStudentPage;
