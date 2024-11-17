"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  onEditClick: (staff: User) => void;
  onDeleteClick: (staff: User) => void;
};
export const makeColumns = ({
  onEditClick,
  onDeleteClick,
}: Props): ColumnDef<User>[] => [
  {
    id: "name",
    header: "名前",
    accessorFn: (info) => info.name,
  },
  {
    id: "email",
    header: "メールアドレス",
    accessorFn: (info) => info.email,
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
    id: "edit",
    cell: ({ row }) => (
      <Button
        size={"sm"}
        variant={"destructive"}
        onClick={() => onDeleteClick(row.original)}
      >
        削除
      </Button>
    ),
  },
];
