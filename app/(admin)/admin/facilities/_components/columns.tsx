"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement } from "@/lib/facilities";
import { Announcement } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, parse, subMonths } from "date-fns";
import React, { useEffect } from "react";

const AnnouncementCell = ({
  row,
}: {
  row: Row<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement>;
}) => {
  const [month, setMonth] = React.useState(new Date());
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

  const handleMonthChange = React.useCallback(
    async (month: Date) => {
      const announcements = row.original.announcements.filter(
        (announcement) =>
          parse(announcement.displayStartMonth, "yyyy-MM", new Date()) <=
            month &&
          month <= parse(announcement.displayEndMonth, "yyyy-MM", new Date())
      );
      setAnnouncements(announcements);
      setMonth(month);
    },
    [row.original.announcements]
  );

  useEffect(() => {
    handleMonthChange(month);
  }, [handleMonthChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <Calendar
        className="rounded-md border w-fit"
        month={month}
        onMonthChange={handleMonthChange}
        classNames={{
          caption: "flex justify-center relative items-center",
          table: "w-[252px] !mt-0",
          head_row: "hidden",
          row: "hidden",
        }}
      />

      <div className="text-center">
        {announcements.length > 0 ? (
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement.id}>
                {format(
                  parse(announcement.displayStartMonth, "yyyy-MM", new Date()),
                  "yyyy年M月"
                )}
                ~
                {format(
                  parse(announcement.displayEndMonth, "yyyy-MM", new Date()),
                  "yyyy年M月"
                )}
                : {announcement.content}
              </li>
            ))}
          </ul>
        ) : (
          <span>お知らせはありません</span>
        )}
      </div>
    </div>
  );
};

const ScheduleEditablePeriodCell = ({
  row,
}: {
  row: Row<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement>;
}) => {
  const [month, setMonth] = React.useState(new Date());
  const [month2, setMonth2] = React.useState(new Date());
  const [period, setPeriod] = React.useState<
    | FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement["scheduleEditablePeriods"][0]
    | undefined
  >();

  const handleMonthChange = React.useCallback(
    async (month: Date) => {
      const period = row.original.scheduleEditablePeriods.find((period) => {
        const targetMonth = parse(period.targetMonth, "yyyy-MM", new Date());
        return (
          targetMonth.getFullYear() === month.getFullYear() &&
          targetMonth.getMonth() === month.getMonth()
        );
      });
      setPeriod(period);
      setMonth(month);
      setMonth2(subMonths(month, 1));
    },
    [row.original.scheduleEditablePeriods]
  );

  useEffect(() => {
    handleMonthChange(month);
  }, [handleMonthChange]);

  return (
    <div className="flex flex-col items-center gap-2 justify-start">
      <Calendar
        className="rounded-md border w-fit"
        month={month}
        onMonthChange={handleMonthChange}
        classNames={{
          caption: "flex justify-center relative items-center",
          table: "w-[252px] !mt-0",
          head_row: "hidden",
          row: "hidden",
        }}
      />

      <Calendar
        mode="range"
        className="rounded-md border w-fit"
        selected={{
          from: period && new Date(period.fromDate),
          to: period && new Date(period.toDate),
        }}
        month={month2}
        onMonthChange={setMonth2}
      />
    </div>
  );
};

type Props = {
  onEditClick: (
    facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement
  ) => void;
};
export const makeColumns = ({
  onEditClick,
}: Props): ColumnDef<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement>[] => [
  {
    id: "name",
    header: "教室名",
    cell: ({ row }) => row.original.name,
  },
  {
    id: "announcement",
    header: "お知らせ",
    cell: AnnouncementCell,
  },
  {
    id: "schedule-editable-period",
    header: "予定入力可能期間",
    cell: ScheduleEditablePeriodCell,
  },
  {
    id: "meal-setting",
    header: "給食の受付",
    cell: ({ row }) => (
      <Calendar
        className="rounded-md border w-fit"
        modifiers={{
          mealActive: row.original.mealSettings.map((mealSetting) => ({
            from: new Date(mealSetting.activeFromDate),
            to: new Date(mealSetting.activeToDate),
          })),
        }}
        modifiersClassNames={{
          mealActive:
            "bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground",
        }}
      />
    ),
  },
  {
    id: "edit",
    cell: ({ row }) => (
      <Button onClick={() => onEditClick(row.original)} size="sm">
        編集
      </Button>
    ),
  },
];
