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
import { School } from "@prisma/client";
import { SchoolCreateForm } from "./school-create-form";
import { SchoolUpdateForm } from "./school-update-form";

type DialogType = "create" | "update";

type Props = {
  schools: School[];
};

const DataTableSection = ({ schools }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("create");
  const [clickedSchool, setClickedSchool] = useState<School | undefined>();

  const handleEditClick = (school: School) => {
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
        <DialogContent>
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
