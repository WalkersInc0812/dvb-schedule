"use client";

import { StudentWithParntAndFacilityAndSchoolAndClasses } from "@/lib/students";
import React from "react";
import { DataTable } from "./data-table";
import { makeColumns } from "./columns";

type Props = {
  students: StudentWithParntAndFacilityAndSchoolAndClasses[];
};

const DataTableSection = ({ students }: Props) => {
  const handleEditClick = (
    student: StudentWithParntAndFacilityAndSchoolAndClasses
  ) => {
    alert("TODO: 実装する");
  };

  const handleDeleteClick = (
    student: StudentWithParntAndFacilityAndSchoolAndClasses
  ) => {
    alert("TODO: 実装する");
  };

  const columns = makeColumns({
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <>
      <DataTable columns={columns} data={students} />
    </>
  );
};

export default DataTableSection;
