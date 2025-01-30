"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
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
    id: "edit",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size={"sm"}
              variant={"destructive"}
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
];
