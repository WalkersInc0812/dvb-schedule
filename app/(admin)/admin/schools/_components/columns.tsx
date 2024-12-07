"use client";

import { Button } from "@/components/ui/button";
import { SchoolWithClassesAndStudentsCount } from "@/lib/schools";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  onEditClick: (school: SchoolWithClassesAndStudentsCount) => void;
  onDeleteClick: (school: SchoolWithClassesAndStudentsCount) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<SchoolWithClassesAndStudentsCount>[] => [
  {
    id: "name",
    header: "学校名",
    accessorFn: (info) => info.name,
  },
  {
    id: "studentsCount",
    header: "児童数",
    accessorFn: (info) =>
      info.classes.reduce((acc, cur) => acc + cur._count.students, 0) + "人",
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
            {row.getValue("studentsCount") === "0人" ? (
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
            {row.getValue("studentsCount") === "0人" ? (
              <p>クリックするとモーダルが表示されます</p>
            ) : (
              <p>児童がいる学校は削除できません</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
