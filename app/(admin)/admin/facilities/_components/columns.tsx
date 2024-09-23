"use client";

import { Button } from "@/components/ui/button";
import { Facility } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  onEditClick: (facility: Facility) => void;
};
export const makeColumns = ({ onEditClick }: Props): ColumnDef<Facility>[] => [
  {
    id: "name",
    header: "教室名",
    cell: ({ row }) => row.original.name,
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
