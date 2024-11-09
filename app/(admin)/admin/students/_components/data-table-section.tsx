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
import { Facility, School } from "@prisma/client";
import StudentEditForm from "@/components/students/student-edit-form";

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

  const handleEditClick = (
    student: StudentWithParntAndFacilityAndSchoolAndClasses
  ) => {
    setSelectedStudent(student);
    setDialogType("edit");
    setDialogOpen(true);
  };

  const handleDeleteClick = (
    student: StudentWithParntAndFacilityAndSchoolAndClasses
  ) => {
    alert("TODO: 実装する");
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
              {dialogType === "edit" && selectedStudent && (
                <StudentEditForm
                  student={selectedStudent}
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
