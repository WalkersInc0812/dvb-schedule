"use client";

import { formatCaption } from "@/components/format-caption";
import { LinkifyText } from "@/components/linkify-text";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount } from "@/lib/facilities";
import { Announcement } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, parse, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AnnouncementCell = ({
  row,
}: {
  row: Row<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount>;
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
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        weekStartsOn={1}
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
                : <LinkifyText text={announcement.content} />
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
  row: Row<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount>;
}) => {
  const [month, setMonth] = React.useState(new Date());
  const [month2, setMonth2] = React.useState(new Date());
  const [period, setPeriod] = React.useState<
    | FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount["scheduleEditablePeriods"][0]
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
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        weekStartsOn={1}
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
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        weekStartsOn={1}
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
    facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount
  ) => void;
  onDeleteClick: (
    facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount
  ) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount>[] => [
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
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        weekStartsOn={1}
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
    id: "studentsCount",
    header: "児童数",
    accessorFn: (info) => info._count.students,
    cell: ({ row }) => (
      <p className="min-w-12 text-center">{row.original._count.students}人</p>
    ),
  },
  {
    id: "edit",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={"sm"} onClick={() => onEditClick(row.original)}>
              編集
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>クリックするとモーダルが表示されます</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "delete",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {row.getValue("studentsCount") === 0 ? (
              <Button
                size={"sm"}
                variant="destructive"
                onClick={() => onDeleteClick(row.original)}
              >
                削除
              </Button>
            ) : (
              <Button
                size={"sm"}
                variant="destructive"
                className="cursor-default opacity-50"
              >
                削除
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {row.getValue("studentsCount") === 0 ? (
              <p>クリックするとモーダルが表示されます</p>
            ) : (
              <p>児童がいる教室は削除できません</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
