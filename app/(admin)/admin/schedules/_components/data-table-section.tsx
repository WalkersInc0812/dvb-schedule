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
import {
  getScheduleLogsByScheduleId,
  ScheduleLogWithUser,
} from "@/lib/scheduleLogs";
import { Logs } from "./logs";
import ScheduleCreateForm from "./schedule-create-form";

type DialogType = "create" | "read" | "update" | "multi-update" | "delete";

type Props = {
  schedules: ScheduleWithStudentAndFacilityAndSchool[];
};

const DataTableSection = ({ schedules }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<DialogType>("read");
  const [clickedSchedule, setClickedSchedule] = React.useState<
    ScheduleWithStudentAndFacilityAndSchool | undefined
  >();
  const [clickedScheduleLogs, setClickedScheduleLogs] = React.useState<
    ScheduleLogWithUser[]
  >([]);
  const [selectedSchedules, setSelectedSchedules] = React.useState<
    ScheduleWithStudentAndFacilityAndSchool[]
  >([]);

  const handleCreateClick = () => {
    setDialogType("create");
    setDialogOpen(true);
  };

  const handleEditClick = async (
    schedule: ScheduleWithStudentAndFacilityAndSchool
  ) => {
    setClickedSchedule(schedule);
    setClickedScheduleLogs(await getScheduleLogsByScheduleId(schedule.id));
    setDialogType("update");
    setDialogOpen(true);
  };

  const handleDeleteClick = async (
    schedule: ScheduleWithStudentAndFacilityAndSchool
  ) => {
    setClickedSchedule(schedule);
    setClickedScheduleLogs(await getScheduleLogsByScheduleId(schedule.id));
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
        onCreateClick={handleCreateClick}
        onMultiUpdateClick={handleMultiUpdateClick}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" ? (
                <ScheduleCreateForm
                  onSuccess={() => {
                    setDialogOpen(false);
                  }}
                />
              ) : dialogType === "update" && clickedSchedule ? (
                <ScheduleUpdateForm
                  schedule={clickedSchedule}
                  mealServable={true}
                  logs={<Logs value={clickedScheduleLogs} />}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedSchedule(undefined);
                  }}
                />
              ) : dialogType === "delete" && clickedSchedule ? (
                <ScheduleDeleteForm
                  schedule={clickedSchedule}
                  logs={<Logs value={clickedScheduleLogs} />}
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
