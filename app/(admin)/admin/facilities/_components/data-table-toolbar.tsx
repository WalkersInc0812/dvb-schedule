"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-end">
      <Button onClick={() => alert("TODO: 実装する")}>
        <Icons.circlePlus className="mr-2 w-4 h-4" />
        教室を新規登録する
      </Button>
    </div>
  );
}
