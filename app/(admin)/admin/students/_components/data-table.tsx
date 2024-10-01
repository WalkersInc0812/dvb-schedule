"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import { useState } from "react";
import { DataTablePagination } from "../../../../../components/data-table/data-table-pagination";
import { DataTableBody } from "@/components/data-table/data-table-body";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { DataTableToolbar } from "./data-table-toolbar";
import { StudentWithParntAndFacilityAndSchoolAndClasses } from "@/lib/students";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import StudentCreateForm from "@/components/students/student-create-form";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <DataTableToolbar
          table={table}
          facilities={Array.from(
            new Set(
              data.map(
                (student) =>
                  (student as StudentWithParntAndFacilityAndSchoolAndClasses)
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
                (student) =>
                  (student as StudentWithParntAndFacilityAndSchoolAndClasses)
                    .school.name
              )
            )
          )
            .sort((a, b) => a.localeCompare(b))
            .map((name) => ({
              value: name,
              label: name,
            }))}
        />
        <Button onClick={() => setDialogOpen(true)}>
          <Icons.circlePlus className="mr-2 w-4 h-4" />
          新規登録
        </Button>
      </div>
      <div>
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} showSelectedRowCount={false} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              <StudentCreateForm />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
