"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import { useState } from "react";
import { DataTablePagination } from "../../../../../components/data-table/data-table-pagination";
import { DataTableBody } from "@/components/data-table/data-table-body";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { DataTableToolbar } from "./data-table-toobar";
import { ScheduleWithStudentAndFacilityAndSchool } from "@/lib/schedules";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onCreateClick: () => void;
  onMultiUpdateClick: (
    schedules: ScheduleWithStudentAndFacilityAndSchool[]
  ) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCreateClick,
  onMultiUpdateClick,
}: DataTableProps<ScheduleWithStudentAndFacilityAndSchool, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        facilities={Array.from(
          new Set(
            data.map(
              (schedule) =>
                (schedule as ScheduleWithStudentAndFacilityAndSchool).student
                  .facility.name
            )
          )
        )
          .sort((a, b) => a.localeCompare(b))
          .map((name) => ({
            value: name,
            label: name,
          }))}
        schools={Array.from(
          new Set(
            data.map(
              (schedule) =>
                (schedule as ScheduleWithStudentAndFacilityAndSchool).student
                  .school.name
            )
          )
        )
          .sort((a, b) => a.localeCompare(b))
          .map((name) => ({
            value: name,
            label: name,
          }))}
        onMultiUpdateClick={onMultiUpdateClick}
        onCreateClick={onCreateClick}
      />
      <div>
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} showSelectedRowCount={true} />
    </div>
  );
}
