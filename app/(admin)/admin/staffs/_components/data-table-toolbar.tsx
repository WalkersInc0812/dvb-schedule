"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

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
      <Button onClick={onCreateClick}>
        <Icons.circlePlus className="mr-2 w-4 h-4" />
        職員を新規登録する
      </Button>
    </div>
  );
}
