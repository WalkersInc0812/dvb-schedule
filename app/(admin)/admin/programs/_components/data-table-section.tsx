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
import { ProgramCreateForm } from "./program-create-form";
import { ProgramUpdateForm } from "./program-update-form";
import { ProgramWithFixedUsageDaysCount } from "@/lib/programs";
import ProgramDeleteForm from "./program-delete-form";

type DialogType = "create" | "update" | "delete";

type Props = {
  programs: ProgramWithFixedUsageDaysCount[];
};

const DataTableSection = ({ programs }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("create");
  const [clickedProgram, setClickedProgram] = useState<
    ProgramWithFixedUsageDaysCount | undefined
  >();

  const handleEditClick = (program: ProgramWithFixedUsageDaysCount) => {
    setClickedProgram(program);
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setClickedProgram(undefined);
    setDialogType("create");
    setDialogOpen(true);
  };

  const handleDeleteClick = (program: ProgramWithFixedUsageDaysCount) => {
    setClickedProgram(program);
    setDialogType("delete");
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
        data={programs}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" && (
                <ProgramCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedProgram(undefined);
                  }}
                />
              )}
              {dialogType === "update" && clickedProgram && (
                <ProgramUpdateForm
                  program={clickedProgram}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedProgram(undefined);
                  }}
                />
              )}
              {dialogType === "delete" && clickedProgram && (
                <ProgramDeleteForm
                  program={clickedProgram}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedProgram(undefined);
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
