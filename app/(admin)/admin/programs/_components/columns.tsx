"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProgramWithFixedUsageDaysCount } from "@/lib/programs";

type Props = {
  onEditClick: (program: ProgramWithFixedUsageDaysCount) => void;
  onDeleteClick: (program: ProgramWithFixedUsageDaysCount) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<ProgramWithFixedUsageDaysCount>[] => [
  {
    id: "name",
    header: "習い事名",
    accessorFn: (info) => info.name,
  },
  {
    id: "shortName",
    header: "習い事名(省略形)",
    accessorFn: (info) => info.shortName,
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
            {row.original._count.fixedUsageDaysOfWeek1 === 0 &&
            row.original._count.fixedUsageDaysOfWeek2 === 0 &&
            row.original._count.fixedUsageDaysOfWeek3 === 0 ? (
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
            {row.original._count.fixedUsageDaysOfWeek1 === 0 &&
            row.original._count.fixedUsageDaysOfWeek2 === 0 &&
            row.original._count.fixedUsageDaysOfWeek3 === 0 ? (
              <p>クリックするとモーダルが表示されます</p>
            ) : (
              <p>固定利用曜日で設定されているため、削除できません</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
