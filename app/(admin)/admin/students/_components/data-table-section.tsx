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
import {
  Facility,
  FixedUsageDayOfWeek,
  School,
  Schedule,
} from "@prisma/client";
import StudentEditForm from "@/components/students/student-edit-form";
import { getFixedUsageDayOfWeeksWithProgramsByStudentId } from "@/lib/fixedUsageDayOfWeeks";
import StudentDeleteForm from "./student-delete-form";
import StudentCreateFormWithExistingParent from "./student-create-form-with-existing-parent";

type DialogType =
  | "create"
  | "create-with-existing-parent"
  | "detail"
  | "edit"
  | "delete";

type Props = {
  students: StudentWithParntAndFacilityAndSchoolAndClasses[];
  facilities: Facility[];
  schools: School[];
  schedules: Schedule[];
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
    setSelectedStudent(student);
    setDialogType("delete");
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setDialogType("create");
    setDialogOpen(true);
  };

  const handleCreateWithExistingParentClick = () => {
    setDialogType("create-with-existing-parent");
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
        onCreateWithExistingParentClick={handleCreateWithExistingParentClick}
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
              {dialogType === "create-with-existing-parent" && (
                <StudentCreateFormWithExistingParent
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
              {dialogType === "delete" && selectedStudent && (
                <StudentDeleteForm
                  student={selectedStudent}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setSelectedStudent(null);
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
