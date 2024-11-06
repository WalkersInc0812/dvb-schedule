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
import { Program } from "@prisma/client";
import { ProgramCreateForm } from "./program-create-form";
import { ProgramUpdateForm } from "./program-update-form";

type DialogType = "create" | "update";

type Props = {
  programs: Program[];
};

const DataTableSection = ({ programs }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("create");
  const [clickedProgram, setClickedProgram] = useState<Program | undefined>();

  const handleEditClick = (program: Program) => {
    setClickedProgram(program);
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setClickedProgram(undefined);
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
        data={programs}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" ? (
                <ProgramCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedProgram(undefined);
                  }}
                />
              ) : dialogType === "update" && clickedProgram ? (
                <ProgramUpdateForm
                  program={clickedProgram}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedProgram(undefined);
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
