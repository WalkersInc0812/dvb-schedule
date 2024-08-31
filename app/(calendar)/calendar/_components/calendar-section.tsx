"use client";

import React from "react";

import { Calendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { Schedule } from "@prisma/client";
import { ScheduleCreateForm } from "@/components/schedules/schedule-create-form";
import { ScheduleDetail } from "@/components/schedules/schedule-detail";
import { ScheduleUpdateForm } from "@/components/schedules/schedule-update-form";
import { ScheduleDeleteForm } from "@/components/schedules/schedule-delete-form";
import { ja } from "date-fns/locale";
import { DateFormatter } from "react-day-picker";

type DialogType = "create" | "read" | "update" | "delete";

type Props = {
  studentId: string;
  schedules: Schedule[];
};
export const CalendarSection = ({ studentId, schedules }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickedDate, setClickedDate] = React.useState<Date | undefined>();
  const [clickedSchedule, setClickedSchedule] = React.useState<
    Schedule | undefined
  >();
  const [dialogType, setDialogType] = React.useState<DialogType>("read");

  const handleDayClick = (date: Date) => {
    const _clickedSchedule = schedules.find((s) => isSameDay(s.start, date));
    if (_clickedSchedule) {
      setDialogType("read");
    } else {
      setDialogType("create");
    }

    setClickedDate(date);
    setClickedSchedule(_clickedSchedule);
    setDialogOpen(true);
  };

  const handleClickUpdateInDetail = () => {
    setDialogType("update");
  };

  const handleClickDeleteInDetail = () => {
    setDialogType("delete");
  };

  const formatCaption: DateFormatter = (date) => {
    return (
      <p className="text-[18px] font-medium">
        {format(date, "yyyy年MM月", { locale: ja })}
      </p>
    );
  };

  return (
    <div className="p-[16px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[22px] font-bold">カレンダー</h2>
      </div>

      <div className="flex justify-center mb-[16px]">
        <p className="text-[14px] font-medium">
          日付をタップすると、予定の確認と編集ができます。
        </p>
      </div>

      <div className="flex justify-center">
        <Calendar
          locale={ja}
          formatters={{ formatCaption }}
          mode="multiple"
          selected={schedules.map((schedule) => schedule.start)}
          onDayClick={handleDayClick}
          weekStartsOn={1}
          className="rounded-md border w-fit"
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {clickedDate &&
                (dialogType === "create" ? (
                  <ScheduleCreateForm
                    studentId={studentId}
                    date={clickedDate}
                    onSuccess={() => {
                      setDialogOpen(false);
                      setClickedDate(undefined);
                    }}
                  />
                ) : dialogType === "read" && clickedSchedule ? (
                  <ScheduleDetail
                    schedule={clickedSchedule}
                    onClickUpdate={handleClickUpdateInDetail}
                    onClickDelete={handleClickDeleteInDetail}
                  />
                ) : dialogType === "update" && clickedSchedule ? (
                  <ScheduleUpdateForm
                    schedule={clickedSchedule}
                    onSuccess={() => {
                      setDialogOpen(false);
                      setClickedDate(undefined);
                    }}
                  />
                ) : dialogType === "delete" && clickedSchedule ? (
                  <ScheduleDeleteForm
                    schedule={clickedSchedule}
                    onSuccess={() => {
                      setDialogOpen(false);
                      setClickedDate(undefined);
                    }}
                  />
                ) : null)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
