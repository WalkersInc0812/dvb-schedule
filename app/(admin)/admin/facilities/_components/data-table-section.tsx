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

type Props = {
  facilities: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement[];
};

export const DataTableSection = ({ facilities }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickedFacility, setClickedFacility] = React.useState<
    FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement | undefined
  >();

  const handleEditClick = (
    facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement
  ) => {
    setClickedFacility(facility);
    setDialogOpen(true);
  };

  const columns = makeColumns({
    onEditClick: handleEditClick,
  });

  return (
    <>
      <DataTable columns={columns} data={facilities} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {clickedFacility ? (
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
