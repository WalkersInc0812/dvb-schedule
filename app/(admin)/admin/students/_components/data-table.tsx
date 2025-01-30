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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onCreateClick?: () => void;
  onCreateWithExistingParentClick?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCreateClick,
  onCreateWithExistingParentClick,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Icons.circlePlus className="mr-2 w-4 h-4" />
              新規登録
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button onClick={onCreateClick} className="w-full">
                      新規登録 (まだ保護者が登録されていない場合)
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>保護者と児童の新規登録を同時に行います</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={onCreateWithExistingParentClick}
                      className="w-full"
                    >
                      新規登録 (すでに保護者が登録されている場合)
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>既存の保護者に新しい児童を登録します</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} showSelectedRowCount={false} />
    </div>
  );
}
