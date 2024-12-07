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
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount } from "@/lib/facilities";
import { FacilityCreateForm } from "@/components/facilities/facility-create-form";
import FacilityDeleteForm from "./facility-delete-form";

type DialogType = "update" | "create" | "delete";

type Props = {
  facilities: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount[];
};

export const DataTableSection = ({ facilities }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<DialogType>("create");
  const [clickedFacility, setClickedFacility] = React.useState<
    | FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount
    | undefined
  >();

  const handleEditClick = (
    facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount
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

  const handleDeleteClick = (
    school: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount
  ) => {
    setClickedFacility(school);
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
        data={facilities}
        onCreateClick={handleCreateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-scroll">
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" && (
                <FacilityCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedFacility(undefined);
                  }}
                />
              )}
              {dialogType === "update" && clickedFacility && (
                <FacilityUpdateForm
                  facility={clickedFacility}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedFacility(undefined);
                  }}
                />
              )}
              {dialogType === "delete" && clickedFacility && (
                <FacilityDeleteForm
                  facility={clickedFacility}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedFacility(undefined);
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
