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
import ScheduleMultiUpdateForm from "@/components/schedules/schedule-multi-update-form";

type DialogType = "read" | "update" | "multi-update" | "delete";

type Props = {
  schedules: ScheduleWithStudentAndFacilityAndSchool[];
};

const DataTableSection = ({ schedules }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<DialogType>("read");
  const [clickedSchedule, setClickedSchedule] = React.useState<
    ScheduleWithStudentAndFacilityAndSchool | undefined
  >();
  const [selectedSchedules, setSelectedSchedules] = React.useState<
    ScheduleWithStudentAndFacilityAndSchool[]
  >([]);

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

  const handleMultiUpdateClick = (
    schedules: ScheduleWithStudentAndFacilityAndSchool[]
  ) => {
    setSelectedSchedules(schedules);
    setDialogType("multi-update");
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
        data={schedules}
        onMultiUpdateClick={handleMultiUpdateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "update" && clickedSchedule ? (
                <ScheduleUpdateForm
                  schedule={clickedSchedule}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedSchedule(undefined);
                  }}
                />
              ) : dialogType === "delete" && clickedSchedule ? (
                <ScheduleDeleteForm
                  schedule={clickedSchedule}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedSchedule(undefined);
                  }}
                />
              ) : dialogType === "multi-update" && selectedSchedules ? (
                <ScheduleMultiUpdateForm
                  schedules={selectedSchedules}
                  onSuccess={() => {
                    setDialogOpen(false);
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
