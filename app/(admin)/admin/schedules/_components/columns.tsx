"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ScheduleWithStudentAndFacilityAndSchool } from "@/lib/schedules";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import { calculateGrade } from "@/lib/students";
import { filterFns } from "@/components/data-table/helpers";

export const formatAndSortForCsv = (
  table: Table<ScheduleWithStudentAndFacilityAndSchool>
) => {
  const formatted = (
    table.getIsSomeRowsSelected()
      ? table.getFilteredSelectedRowModel()
      : table.getFilteredRowModel()
  ).rows
    .map((row) => row.original)
    .map((row) => ({
      日付: format(row.start, "P", { locale: ja }),
      教室名: row.student.facility.name,
      児童氏名: row.student.name,
      開始時間: format(row.start, "p", { locale: ja }),
      終了時間: format(row.end, "p", { locale: ja }),
      学校名: row.student.school.name,
      学年: `${calculateGrade(row.student.schoolEnrollmentAcademicYear)}年`,
      給食の有無: row.meal ? "あり" : "なし",
      備考: row.notes,
    }));

  // 学校、学年、開始時間でソートする
  const sorted = formatted.sort((a, b) => {
    if (a.学校名 === b.学校名) {
      if (a.学年 === b.学年) {
        return a.開始時間.localeCompare(b.開始時間);
      }
      return a.学年.localeCompare(b.学年);
    }
    return a.学校名.localeCompare(b.学校名);
  });

  return sorted;
};

type Props = {
  onEditClick: (schedule: ScheduleWithStudentAndFacilityAndSchool) => void;
  onDeleteClick: (schedule: ScheduleWithStudentAndFacilityAndSchool) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<ScheduleWithStudentAndFacilityAndSchool>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "date",
    header: "日付",
    accessorFn: (info) => format(info.start, "P", { locale: ja }),
    filterFn: filterFns.inDateRange,
  },
  {
    id: "facilityName",
    header: "教室名",
    accessorFn: (info) => info.student.facility.name,
    filterFn: filterFns.arrIncludesSome,
  },
  {
    id: "studentName",
    header: "児童氏名",
    accessorFn: (info) => info.student.name,
  },
  {
    id: "startTime",
    header: "開始時間",
    accessorFn: (info) => format(info.start, "p", { locale: ja }),
  },
  {
    id: "endTime",
    header: "終了時間",
    accessorFn: (info) => format(info.end, "p", { locale: ja }),
  },
  {
    id: "schoolName",
    header: "学校名",
    accessorFn: (info) => info.student.school.name,
    filterFn: filterFns.arrIncludesSome,
  },
  {
    id: "grade",
    header: "学年",
    accessorFn: (info) =>
      `${calculateGrade(info.student.schoolEnrollmentAcademicYear)}年`,
    filterFn: filterFns.arrIncludesSome,
  },
  {
    id: "meal",
    header: "給食の有無",
    accessorFn: (info) => (info.meal ? "あり" : "なし"),
  },
  {
    id: "notes",
    accessorKey: "notes",
    header: "備考",
  },
  {
    id: "edit",
    cell: ({ row }) => (
      <Button size={"sm"} onClick={() => onEditClick(row.original)}>
        編集
      </Button>
    ),
  },
  {
    id: "delete",
    cell: ({ row }) => (
      <Button
        size={"sm"}
        variant="destructive"
        onClick={() => onDeleteClick(row.original)}
      >
        削除
      </Button>
    ),
  },
];
