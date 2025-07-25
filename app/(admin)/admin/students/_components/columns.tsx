"use client";

import { filterFns } from "@/components/data-table/helpers";
import { Button } from "@/components/ui/button";
import {
  calculateGrade,
  StudentWithParntAndFacilityAndSchoolAndClasses,
} from "@/lib/students";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function checkScheduleOfThisMonth(schedules: any, id: string): any {
  if (schedules.length == 0) {
    return "未提出";
  }
  let numOfSchedule = 0;
  const today = new Date();
  const thisMonthFirstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const nextMonthFirstDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
    0,
    0,
    0,
    0
  );
  for (const schedule in schedules) {
    const student = schedules[parseInt(schedule)]["studentId"];
    const dateOfSchedule = new Date(schedules[parseInt(schedule)]["start"]);
    if (
      student == id &&
      dateOfSchedule >= thisMonthFirstDay &&
      dateOfSchedule < nextMonthFirstDay &&
      schedules[parseInt(schedule)]["deletedAt"] == null
    ) {
      numOfSchedule += 1;
    }
  }
  if (numOfSchedule > 0) {
    return numOfSchedule.toString() + "件";
  } else {
    return "未提出";
  }
}

function checkScheduleOfNextMonth(schedules: any, id: string): any {
  if (schedules.length == 0) {
    return "未提出";
  }
  let numOfSchedule = 0;
  const today = new Date();
  const nextMonthFirstDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
    0,
    0,
    0,
    0
  );
  for (const schedule in schedules) {
    const student = schedules[parseInt(schedule)]["studentId"];
    const dateOfSchedule = new Date(schedules[parseInt(schedule)]["start"]);
    if (
      student == id &&
      dateOfSchedule >= nextMonthFirstDay &&
      schedules[parseInt(schedule)]["deletedAt"] == null
    ) {
      numOfSchedule += 1;
    }
  }
  if (numOfSchedule > 0) {
    return numOfSchedule.toString() + "件";
  } else {
    return "未提出";
  }
}

// 保護者が複数の際に保護者名をつなげて表示する
function getParentsName(parents: any): any {
  let parentsName = "";
  for (const parent in parents) {
    parentsName = parentsName + parents[parseInt(parent)].name + " ";
  }
  return parentsName;
}

type Props = {
  onEditClick: (student: any) => void;
  onDeleteClick: (student: any) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<StudentWithParntAndFacilityAndSchoolAndClasses>[] => [
  {
    id: "parentName",
    header: "保護者氏名",
    accessorFn: (info) => getParentsName(info.parents),
  },
  {
    id: "name",
    header: "児童氏名",
    accessorKey: "name",
  },
  {
    id: "scheduleStatusOfThisMonth",
    header: "当月予定",
    accessorFn: (info) => checkScheduleOfThisMonth(info.schedules, info.id),
  },
  {
    id: "scheduleStatusOfNextMonth",
    header: "翌月予定",
    accessorFn: (info) => checkScheduleOfNextMonth(info.schedules, info.id),
  },
  {
    id: "facilityName",
    header: "教室名",
    accessorFn: (info) => info.facility.name,
    filterFn: filterFns.arrIncludesSome,
  },
  {
    id: "schoolName",
    header: "学校名",
    accessorFn: (info) => info.school.name,
    filterFn: filterFns.arrIncludesSome,
  },
  {
    id: "grade",
    header: "学年",
    accessorFn: (info) =>
      `${calculateGrade(info.schoolEnrollmentAcademicYear)}年生`,
    filterFn: filterFns.arrIncludesSome,
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
            <Button
              size={"sm"}
              variant="destructive"
              onClick={() => onDeleteClick(row.original)}
            >
              削除
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
    id: "calendar",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              onClick={() => {
                const url =
                  window.location.origin + `/students/${row.original.id}`;
                window.open(url, "_blank");
              }}
            >
              カレンダー
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>クリックすると別タブでカレンダー画面が開きます</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
