"use client";

import React, { useState } from "react";
import { makeColumns } from "./columns";
import { DataTable } from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { SchoolCreateForm } from "./school-create-form";
import { SchoolUpdateForm } from "./school-update-form";
import { SchoolWithClassesAndStudentsCount } from "@/lib/schools";

type DialogType = "create" | "update";

type Props = {
  schools: SchoolWithClassesAndStudentsCount[];
};

const DataTableSection = ({ schools }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("create");
  const [clickedSchool, setClickedSchool] = useState<
    SchoolWithClassesAndStudentsCount | undefined
  >();

  const handleEditClick = (school: SchoolWithClassesAndStudentsCount) => {
    setClickedSchool(school);
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setClickedSchool(undefined);
    setDialogType("create");
    setDialogOpen(true);
  };

  const columns = makeColumns({
    onEditClick: handleEditClick,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={schools}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-scroll max-w-2xl">
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" ? (
                <SchoolCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedSchool(undefined);
                  }}
                />
              ) : dialogType === "update" && clickedSchool ? (
                <SchoolUpdateForm
                  school={clickedSchool}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedSchool(undefined);
                  }}
                />
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTableSection;
