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
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ScheduleMultiCreateForm } from "@/components/schedules/schedule-multi-create-form";

type Mode = "single" | "multiple";
type DialogType = "create" | "multi-create" | "read" | "update" | "delete";

type Props = {
  studentId: string;
  schedules: Schedule[];
};
export const CalendarSection = ({ studentId, schedules }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickedDate, setClickedDate] = React.useState<Date | undefined>();
  const [selectedDatesForMultiCreate, setSelectedDatesForMultiCreate] =
    React.useState<Date[]>([]);
  const [clickedSchedule, setClickedSchedule] = React.useState<
    Schedule | undefined
  >();
  const [dialogType, setDialogType] = React.useState<DialogType>("read");
  const [mode, setMode] = React.useState<Mode>("single");

  const handleDayClick = (date: Date, modifiers: any) => {
    if (mode === "single") {
      const _clickedSchedule = schedules.find((s) => isSameDay(s.start, date));
      if (_clickedSchedule) {
        setDialogType("read");
      } else {
        setDialogType("create");
      }

      setClickedDate(date);
      setClickedSchedule(_clickedSchedule);
      setDialogOpen(true);
    } else if (mode === "multiple") {
      if (modifiers.selected) {
        return;
      }
      setSelectedDatesForMultiCreate((prev) => {
        if (prev.find((d) => isSameDay(d, date))) {
          return prev.filter((d) => !isSameDay(d, date));
        } else {
          return [...prev, date];
        }
      });
    } else {
      return;
    }
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

  const handleCancelMultiCreate = () => {
    setSelectedDatesForMultiCreate([]);
    setMode("single");
  };

  const handleClickCreateSelectedDatesForMultiCreate = () => {
    setDialogType("multi-create");
    setDialogOpen(true);
  };

  return (
    <div className="p-[16px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[22px] font-bold">カレンダー</h2>
        {mode === "single" ? (
          <Button
            size={"sm"}
            className="flex items-center"
            onClick={() => setMode("multiple")}
          >
            <Icons.circlePlus className="w-4 h-4 mr-2" />
            予定を登録する
          </Button>
        ) : mode === "multiple" ? (
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={handleCancelMultiCreate}
          >
            キャンセル
          </Button>
        ) : (
          <></>
        )}
      </div>

      <div className="flex justify-center mb-[16px]">
        <p className="text-[14px] font-medium">
          日付をタップすると、予定の確認と編集ができます。
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Calendar
          locale={ja}
          formatters={{ formatCaption }}
          mode="multiple"
          selected={schedules.map((schedule) => schedule.start)}
          onDayClick={handleDayClick}
          weekStartsOn={1}
          showOutsideDays={false}
          className="rounded-md border w-fit"
          modifiers={{
            selectedForMultiCreate: selectedDatesForMultiCreate,
          }}
          modifiersClassNames={{
            selectedForMultiCreate: "border border-primary",
          }}
        />

        {mode === "multiple" && (
          <div className="flex gap-2">
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={handleCancelMultiCreate}
            >
              キャンセル
            </Button>
            <Button
              size={"sm"}
              className="flex items-center"
              onClick={handleClickCreateSelectedDatesForMultiCreate}
              disabled={selectedDatesForMultiCreate.length === 0}
            >
              {selectedDatesForMultiCreate.length}件の予定を登録する
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {dialogType === "create" && clickedDate ? (
                <ScheduleCreateForm
                  studentId={studentId}
                  date={clickedDate}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedDate(undefined);
                  }}
                />
              ) : dialogType === "multi-create" &&
                selectedDatesForMultiCreate.length > 0 ? (
                <ScheduleMultiCreateForm
                  studentId={studentId}
                  dates={selectedDatesForMultiCreate}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setMode("single");
                    setSelectedDatesForMultiCreate([]);
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
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
