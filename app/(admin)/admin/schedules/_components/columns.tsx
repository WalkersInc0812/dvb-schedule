"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ScheduleWithStudentAndFacilityAndSchool } from "@/lib/schedules";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import { calculateGrade } from "@/lib/students";

type Props = {
  onEditClick: (schedule: ScheduleWithStudentAndFacilityAndSchool) => void;
  onDeleteClick: (schedule: ScheduleWithStudentAndFacilityAndSchool) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<ScheduleWithStudentAndFacilityAndSchool>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "date",
    header: "日付",
    accessorFn: (info) => format(info.start, "P", { locale: ja }),
  },
  {
    id: "facilityName",
    header: "教室名",
    accessorFn: (info) => info.student.facility.name,
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
  },
  {
    id: "grade",
    header: "学年",
    accessorFn: (info) =>
      `${calculateGrade(info.student.schoolEnrollmentAcademicYear)}年`,
  },
  {
    id: "meal",
    header: "給食の有無",
    accessorFn: (info) => (info.meal ? "あり" : "なし"),
  },
  {
    id: "attendance",
    header: "出欠",
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.original.attendance}
          className="cursor-default"
        />
      );
    },
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
