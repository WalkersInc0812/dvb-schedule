import React from "react";
import { TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender, Table } from "@tanstack/react-table";

interface Props<TData> {
  table: Table<TData>;
}
export function DataTableHeader<TData>({ table }: Props<TData>) {
  return (
    <TableHeader className="bg-[#F4F4F5] bg-opacity-50">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
