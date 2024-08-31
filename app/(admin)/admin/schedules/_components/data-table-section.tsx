"use client";

import React from "react";
import { makeColumns } from "./columns";
import { DataTable } from "./data-table";
import { ScheduleWithStudentAndFacilityAndSchool } from "@/lib/schedules";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScheduleUpdateForm } from "@/components/schedules/schedule-update-form";
import { ScheduleDeleteForm } from "@/components/schedules/schedule-delete-form";

type DialogType = "read" | "update" | "delete";

type Props = {
  schedules: ScheduleWithStudentAndFacilityAndSchool[];
};

const DataTableSection = ({ schedules }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<DialogType>("read");
  const [clickedSchedule, setClickedSchedule] = React.useState<
    ScheduleWithStudentAndFacilityAndSchool | undefined
  >();

  const handleEditClick = (
    schedule: ScheduleWithStudentAndFacilityAndSchool
  ) => {
    setClickedSchedule(schedule);
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleDeleteClick = (
    schedule: ScheduleWithStudentAndFacilityAndSchool
  ) => {
    setClickedSchedule(schedule);
    setDialogType("delete");
    setDialogOpen(true);
  };

  const columns = makeColumns({
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <>
      <DataTable columns={columns} data={schedules} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {clickedSchedule &&
                (dialogType === "update" ? (
                  <ScheduleUpdateForm
                    schedule={clickedSchedule}
                    onSuccess={() => {
                      setDialogOpen(false);
                      setClickedSchedule(undefined);
                    }}
                  />
                ) : dialogType === "delete" ? (
                  <ScheduleDeleteForm
                    schedule={clickedSchedule}
                    onSuccess={() => {
                      setDialogOpen(false);
                      setClickedSchedule(undefined);
                    }}
                  />
                ) : null)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTableSection;
