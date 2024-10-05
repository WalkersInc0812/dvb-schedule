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

type Props = {
  students: StudentWithParntAndFacilityAndSchoolAndClasses[];
  facilities: Facility[];
  schools: School[];
};

const DataTableSection = ({ students, facilities, schools }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

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
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              <StudentCreateForm
                facilities={facilities}
                schools={schools}
                onSuccess={() => {
                  setDialogOpen(false);
                }}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTableSection;
