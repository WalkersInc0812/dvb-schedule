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
import { User } from "@prisma/client";
import { StaffCreateForm } from "./staff-create-form";
import { StaffUpdateForm } from "./staff-update-form";
import StaffDeleteForm from "./staff-delete-form";

type DialogType = "create" | "update" | "delete";

type Props = {
  staffs: User[];
};

const DataTableSection = ({ staffs }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("create");
  const [clickedStaff, setClickedStaff] = useState<User | undefined>();

  const handleEditClick = (staff: User) => {
    setClickedStaff(staff);
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setClickedStaff(undefined);
    setDialogType("create");
    setDialogOpen(true);
  };

  const handleDeleteClick = (staff: User) => {
    setClickedStaff(staff);
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
        data={staffs}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" ? (
                <StaffCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedStaff(undefined);
                  }}
                />
              ) : dialogType === "update" && clickedStaff ? (
                <StaffUpdateForm
                  staff={clickedStaff}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedStaff(undefined);
                  }}
                />
              ) : dialogType === "delete" && clickedStaff ? (
                <StaffDeleteForm
                  staff={clickedStaff}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedStaff(undefined);
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
