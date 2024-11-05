// TODO: refactor
// TODO: check timezone

"use client";

import React, { useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  endOfDay,
  endOfMonth,
  format,
  isSameDay,
  parse,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { Schedule, ScheduleEditablePeriod } from "@prisma/client";
import { ScheduleCreateForm } from "@/components/schedules/schedule-create-form";
import { ScheduleDetail } from "@/components/schedules/schedule-detail";
import { ScheduleUpdateForm } from "@/components/schedules/schedule-update-form";
import { ScheduleDeleteForm } from "@/components/schedules/schedule-delete-form";
import { ja } from "date-fns/locale";
import { DateFormatter } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ScheduleMultiCreateForm } from "@/components/schedules/schedule-multi-create-form";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement } from "@/lib/facilities";
import {
  getScheduleLogsByScheduleId,
  ScheduleLogWithUser,
} from "@/lib/scheduleLogs";
import { Logs } from "./logs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FixedUsageDayOfWeekWithPrograms } from "@/lib/fixedUsageDayOfWeeks";

type Mode = "single" | "multiple";
type DialogType = "create" | "multi-create" | "read" | "update" | "delete";

type Props = {
  studentId: string;
  facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement;
  schedules: Schedule[];
  fixedUsageDayOfWeeks: FixedUsageDayOfWeekWithPrograms[];
};
export const CalendarSection = ({
  studentId,
  facility,
  schedules,
  fixedUsageDayOfWeeks,
}: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickedDate, setClickedDate] = React.useState<Date | undefined>();
  const [isMonthEditable, setIsMonthEditable] = React.useState(false);
  const [selectedDatesForMultiCreate, setSelectedDatesForMultiCreate] =
    React.useState<Date[]>([]);
  const [clickedSchedule, setClickedSchedule] = React.useState<
    Schedule | undefined
  >();
  const [clickedScheduleLogs, setClickedScheduleLogs] = React.useState<
    ScheduleLogWithUser[]
  >([]);
  const [dialogType, setDialogType] = React.useState<DialogType>("read");
  const [mode, setMode] = React.useState<Mode>("single");
  const [month, setMonth] = React.useState<Date>(new Date());
  const [scheduleEditablePeriod, setScheduleEditablePeriod] = React.useState<
    ScheduleEditablePeriod | undefined
  >(undefined);
  // TODO: refactor
  // TODO: check timezone
  const announcements = facility.announcements.filter(
    (a) =>
      parse(a.displayStartMonth, "yyyy-MM", new Date()) <= month &&
      month <= parse(a.displayEndMonth, "yyyy-MM", new Date())
  );
  // TODO: refactor
  // TODO: check timezone
  const mealServablePeriods = facility.mealSettings.filter(
    (s) =>
      !(
        endOfDay(parse(s.activeFromDate, "yyyy-MM-dd", new Date())) <
          startOfMonth(month) ||
        endOfMonth(month) <
          startOfDay(parse(s.activeToDate, "yyyy-MM-dd", new Date()))
      )
  );
  {
    /* TODO: improve performance */
  }
  const fixedUsageDayOfWeeksInMonth = fixedUsageDayOfWeeks.filter(
    (f) =>
      startOfMonth(month) <= parse(f.month, "yyyy-MM", new Date()) &&
      parse(f.month, "yyyy-MM", new Date()) <= endOfMonth(month)
  );
  const fixedUsageDayOfWeeksByDay = {
    1: fixedUsageDayOfWeeksInMonth.find((f) => f.dayOfWeek === 1),
    2: fixedUsageDayOfWeeksInMonth.find((f) => f.dayOfWeek === 2),
    3: fixedUsageDayOfWeeksInMonth.find((f) => f.dayOfWeek === 3),
    4: fixedUsageDayOfWeeksInMonth.find((f) => f.dayOfWeek === 4),
    5: fixedUsageDayOfWeeksInMonth.find((f) => f.dayOfWeek === 5),
  };

  const handleMonthChange = (date: Date) => {
    const targetMonth = format(date, "yyyy-MM");
    const period = facility.scheduleEditablePeriods.find(
      (p) => p.targetMonth === targetMonth
    );
    setScheduleEditablePeriod(period);
    setIsMonthEditable(
      !!period &&
        startOfDay(parse(period.fromDate, "yyyy-MM-dd", new Date())) <=
          new Date() &&
        new Date() <= endOfDay(parse(period.toDate, "yyyy-MM-dd", new Date()))
    );

    setMonth(date);
  };
  useEffect(() => {
    handleMonthChange(month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDayClick = async (date: Date, modifiers: any) => {
    // date の yyyy-MM から scheduleEditablePeriod を取得し、その scheduleEditablePeriod の fromDate と toDate の中に 現在の日付が含まれているかを確認する
    const targetMonth = format(date, "yyyy-MM");
    const targetScheduleEditablePeriod = facility.scheduleEditablePeriods.find(
      (p) => p.targetMonth === targetMonth
    );
    const editable =
      !!targetScheduleEditablePeriod &&
      startOfDay(
        parse(targetScheduleEditablePeriod.fromDate, "yyyy-MM-dd", new Date())
      ) <= new Date() &&
      new Date() <=
        endOfDay(
          parse(targetScheduleEditablePeriod.toDate, "yyyy-MM-dd", new Date())
        );

    // editable ではなく、 create の時はそのままreturn
    if (!editable && !schedules.find((s) => isSameDay(s.start, date))) {
      return;
    }

    if (mode === "single") {
      const _clickedSchedule = schedules.find((s) => isSameDay(s.start, date));
      if (_clickedSchedule) {
        setDialogType("read");

        const logs = await getScheduleLogsByScheduleId(_clickedSchedule.id);
        setClickedScheduleLogs(logs);
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
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[22px] font-bold">カレンダー</h2>
        {isMonthEditable &&
          (mode === "single" ? (
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
          ))}
        {}
      </div>

      <div className="mb-4 space-y-1">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-0 text-[14px] justify-start gap-1">
              固定利用曜日を確認する
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <Table className="text-[12px] mb-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center px-2">曜日</TableHead>
                    <TableHead className="text-center px-2">
                      月{fixedUsageDayOfWeeksByDay["1"] && "⚪︎"}
                    </TableHead>
                    <TableHead className="text-center px-2">
                      火{fixedUsageDayOfWeeksByDay["2"] && "⚪︎"}
                    </TableHead>
                    <TableHead className="text-center px-2">
                      水{fixedUsageDayOfWeeksByDay["3"] && "⚪︎"}
                    </TableHead>
                    <TableHead className="text-center px-2">
                      木{fixedUsageDayOfWeeksByDay["4"] && "⚪︎"}
                    </TableHead>
                    <TableHead className="text-center px-2">
                      金{fixedUsageDayOfWeeksByDay["5"] && "⚪︎"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {/* TODO: improve performance */}
                <TableBody className="text-center">
                  <TableRow>
                    <TableCell className="p-2">登園時間</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.startTime || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-dashed">
                    <TableCell className="p-2">お迎え時間</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.endTime || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">お迎えバス</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.needPickup && "⚪︎"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-dashed bg-primary bg-opacity-5">
                    <TableCell className="p-2">①</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.program1?.shortName || f?.program1?.name || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-primary bg-opacity-5">
                    <TableCell className="p-2">時間</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.program1StartTime || ""}
                        <br />
                        {f?.program1EndTime ? `~${f?.program1EndTime}` : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-dashed bg-primary bg-opacity-5">
                    <TableCell className="p-2">②</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.program2?.shortName || f?.program2?.name || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-primary bg-opacity-5">
                    <TableCell className="p-2">時間</TableCell>
                    {Object.values(fixedUsageDayOfWeeksByDay).map((f) => (
                      <TableCell className="p-2" key={f?.id}>
                        {f?.program2StartTime || ""}
                        <br />
                        {f?.program2EndTime ? `~${f?.program2EndTime}` : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="text-[14px] font-medium">
          日付をタップすると、予定の確認と編集ができます。
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Calendar
          locale={ja}
          formatters={{ formatCaption }}
          mode="multiple"
          month={month}
          onMonthChange={handleMonthChange}
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
            disabled: "text-red-700",
          }}
          disabled={[
            {
              dayOfWeek: [0, 6],
            },
            (day: Date) => {
              // TODO: 仮置き
              const closed = [
                "12/26",
                "12/27",
                "12/28",
                "12/29",
                "12/30",
                "12/31",
                "01/01",
                "01/02",
                "01/03",
                "01/04",
              ];

              return closed.includes(format(day, "MM/dd"));
            },
          ]}
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

        {announcements.length > 0 && (
          <div className="w-full">
            <p className="text-[14px]">
              お知らせ: {announcements.map((a) => a.content).join(", ")}
            </p>
          </div>
        )}

        {scheduleEditablePeriod && (
          <p className="text-[14px] text-left w-full">
            編集可能期間: {scheduleEditablePeriod.fromDate} ~{" "}
            {scheduleEditablePeriod.toDate}
          </p>
        )}

        {mealServablePeriods.length > 0 && (
          <div className="w-full">
            <p className="text-[14px]">
              給食提供期間:{" "}
              {mealServablePeriods
                .map((s) => `${s.activeFromDate} ~ ${s.activeToDate}`)
                .join(", ")}
            </p>
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
                  mealServable={
                    !!facility.mealSettings.find(
                      (s) =>
                        startOfDay(
                          parse(s.activeFromDate, "yyyy-MM-dd", new Date())
                        ) <= clickedDate &&
                        clickedDate <=
                          endOfDay(
                            parse(s.activeToDate, "yyyy-MM-dd", new Date())
                          )
                    )
                  }
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
                  mealSettings={facility.mealSettings}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setMode("single");
                    setSelectedDatesForMultiCreate([]);
                  }}
                />
              ) : dialogType === "read" && clickedSchedule ? (
                <ScheduleDetail
                  schedule={clickedSchedule}
                  editablePeriod={facility.scheduleEditablePeriods.find(
                    (p) =>
                      p.targetMonth === format(clickedSchedule.start, "yyyy-MM")
                  )}
                  logs={<Logs value={clickedScheduleLogs} />}
                  onClickUpdate={handleClickUpdateInDetail}
                  onClickDelete={handleClickDeleteInDetail}
                />
              ) : dialogType === "update" && clickedSchedule ? (
                <ScheduleUpdateForm
                  schedule={clickedSchedule}
                  mealServable={facility.mealSettings.some(
                    (s) =>
                      startOfDay(
                        parse(s.activeFromDate, "yyyy-MM-dd", new Date())
                      ) <= clickedSchedule.start &&
                      clickedSchedule.start <=
                        endOfDay(
                          parse(s.activeToDate, "yyyy-MM-dd", new Date())
                        )
                  )}
                  logs={<Logs value={clickedScheduleLogs} />}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedDate(undefined);
                  }}
                />
              ) : dialogType === "delete" && clickedSchedule ? (
                <ScheduleDeleteForm
                  schedule={clickedSchedule}
                  logs={<Logs value={clickedScheduleLogs} />}
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
