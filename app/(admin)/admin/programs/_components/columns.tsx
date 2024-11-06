"use client";

import { Button } from "@/components/ui/button";
import { Program } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  onEditClick: (program: Program) => void;
};
export const makeColumns = ({ onEditClick }: Props): ColumnDef<Program>[] => [
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
      <Button size={"sm"} onClick={() => onEditClick(row.original)}>
        編集
      </Button>
    ),
  },
];
