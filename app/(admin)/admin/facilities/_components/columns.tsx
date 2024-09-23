"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement } from "@/lib/facilities";
import { Announcement } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { parse } from "date-fns";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Calendar
        className="rounded-md border w-fit"
        month={month}
        onMonthChange={handleMonthChange}
        classNames={{
          table: "w-[252px]",
          head_row: "hidden",
          row: "hidden",
        }}
      />

      {announcements.length > 0 ? (
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement.id}>{announcement.content}</li>
          ))}
        </ul>
      ) : (
        <span>お知らせはありません</span>
      )}
    </>
  );
};

const ScheduleEditablePeriodCell = ({
  row,
}: {
  row: Row<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement>;
}) => {
  const [month, setMonth] = React.useState(new Date());
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
    },
    [row.original.scheduleEditablePeriods]
  );

  useEffect(() => {
    handleMonthChange(month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Calendar
        className="rounded-md border w-fit"
        month={month}
        onMonthChange={handleMonthChange}
        classNames={{
          table: "w-[252px]",
          head_row: "hidden",
          row: "hidden",
        }}
      />

      {period ? (
        <span>
          {period.fromDate} 〜 {period.toDate}
        </span>
      ) : (
        <span>予定入力可能期間はありません</span>
      )}
    </>
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
          mealActive: "bg-blue-200 hover:bg-blue-200",
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
