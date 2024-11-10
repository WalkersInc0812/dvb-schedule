"use client";

import { StudentWithParntAndFacilityAndSchoolAndClasses } from "@/lib/students";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { makeColumns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import StudentCreateForm from "@/components/students/student-create-form";
import { Facility, FixedUsageDayOfWeek, School } from "@prisma/client";
import StudentEditForm from "@/components/students/student-edit-form";
import { getFixedUsageDayOfWeeksWithProgramsByStudentId } from "@/lib/fixedUsageDayOfWeeks";

type DialogType = "create" | "detail" | "edit" | "delete";

type Props = {
  students: StudentWithParntAndFacilityAndSchoolAndClasses[];
  facilities: Facility[];
  schools: School[];
};

const DataTableSection = ({ students, facilities, schools }: Props) => {
  const [dialogType, setDialogType] = useState<DialogType>("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithParntAndFacilityAndSchoolAndClasses | null>();
  const [
    selectedStudentfixedUsageDayOfWeeks,
    setSelectedStudentfixedUsageDayOfWeeks,
  ] = useState<FixedUsageDayOfWeek[]>();

  const handleEditClick = async (
    student: StudentWithParntAndFacilityAndSchoolAndClasses
  ) => {
    alert("TODO: 未実装");
    return;
    setSelectedStudent(student);
    const fixedUsageDayOfWeeks =
      await getFixedUsageDayOfWeeksWithProgramsByStudentId(student.id);
    setSelectedStudentfixedUsageDayOfWeeks(fixedUsageDayOfWeeks);
    setDialogType("edit");
    setDialogOpen(true);
  };

  const handleDeleteClick = (
    student: StudentWithParntAndFacilityAndSchoolAndClasses
  ) => {
    alert("TODO: 未実装");
  };

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  const columns = makeColumns({
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={students}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-scroll max-w-2xl">
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" && (
                <StudentCreateForm
                  facilities={facilities}
                  schools={schools}
                  onSuccess={() => {
                    setDialogOpen(false);
                  }}
                />
              )}
              {dialogType === "edit" &&
                selectedStudent &&
                selectedStudentfixedUsageDayOfWeeks && (
                  <StudentEditForm
                    student={selectedStudent}
                    studentFixedUsageDayOfWeeks={
                      selectedStudentfixedUsageDayOfWeeks
                    }
                    facilities={facilities}
                    schools={schools}
                    onSuccess={() => {
                      setDialogOpen(false);
                    }}
                  />
                )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTableSection;
