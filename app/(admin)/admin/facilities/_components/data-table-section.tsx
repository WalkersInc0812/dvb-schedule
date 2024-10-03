"use client";

import React from "react";
import { makeColumns } from "./columns";
import { DataTable } from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FacilityUpdateForm } from "@/components/facilities/facility-update-form";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement } from "@/lib/facilities";
import { FacilityCreateForm } from "@/components/facilities/facility-create-form";

type DialogType = "update" | "create";

type Props = {
  facilities: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement[];
};

export const DataTableSection = ({ facilities }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<DialogType>("create");
  const [clickedFacility, setClickedFacility] = React.useState<
    FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement | undefined
  >();

  const handleEditClick = (
    facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement
  ) => {
    setClickedFacility(facility);
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setClickedFacility(undefined);
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
        data={facilities}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="h-[90vh] overflow-scroll">
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" ? (
                <FacilityCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedFacility(undefined);
                  }}
                />
              ) : dialogType === "update" && clickedFacility ? (
                <FacilityUpdateForm
                  facility={clickedFacility}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedFacility(undefined);
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
