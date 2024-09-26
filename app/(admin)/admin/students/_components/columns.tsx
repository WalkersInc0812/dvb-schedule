"use client";

import { filterFns } from "@/components/data-table/helpers";
import { Button } from "@/components/ui/button";
import {
  calculateGrade,
  StudentWithParntAndFacilityAndSchoolAndClasses,
} from "@/lib/students";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorFn: (info) => info.parent.name,
  },
  {
    id: "name",
    header: "児童氏名",
    accessorKey: "name",
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
