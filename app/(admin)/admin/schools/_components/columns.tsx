"use client";

import { Button } from "@/components/ui/button";
import { School } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  onEditClick: (school: School) => void;
};
export const makeColumns = ({ onEditClick }: Props): ColumnDef<School>[] => [
  {
    id: "name",
    header: "学校名",
    accessorFn: (info) => info.name,
  },
  {
    id: "edit",
    cell: ({ row }) => (
      <Button size={"sm"} onClick={() => onEditClick(row.original)}>
        編集
      </Button>
    ),
  },
];
