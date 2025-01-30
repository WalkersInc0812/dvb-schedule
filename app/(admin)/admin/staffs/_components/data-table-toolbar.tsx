"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onCreateClick: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onCreateClick,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={onCreateClick}>
              <Icons.circlePlus className="mr-2 w-4 h-4" />
              職員を新規登録する
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>職員を新しく登録するウィンドウがポップアップします</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
