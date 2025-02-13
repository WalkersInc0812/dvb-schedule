"use client";

import { Table } from "@tanstack/react-table";

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  facilities: {
    value: string;
    label: string;
  }[];
  schools: {
    value: string;
    label: string;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  facilities,
  schools,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const deleted = searchParams.get("deleted") === "true";

  return (
    <div className="flex items-center justify-between">
      <div className="inline-block flex-1 items-center space-x-2">
        <Input
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          placeholder="フリーワードで検索"
          className="max-w-[286px]"
        />
        {table.getColumn("facilityName") && (
          <DataTableFacetedFilter
            column={table.getColumn("facilityName")}
            title="教室で絞り込む"
            options={facilities}
          />
        )}
        {table.getColumn("schoolName") && (
          <DataTableFacetedFilter
            column={table.getColumn("schoolName")}
            title="学校で絞り込む"
            options={schools}
          />
        )}
        {table.getColumn("grade") && (
          <DataTableFacetedFilter
            column={table.getColumn("grade")}
            title="学年で絞り込む"
            // TODO: refactor
            options={[
              { value: "1年生", label: "1年生" },
              { value: "2年生", label: "2年生" },
              { value: "3年生", label: "3年生" },
              { value: "4年生", label: "4年生" },
              { value: "5年生", label: "5年生" },
              { value: "6年生", label: "6年生" },
            ]}
          />
        )}
        {table.getColumn("scheduleStatusOfThisMonth") && (
          <DataTableFacetedFilter
            column={table.getColumn("scheduleStatusOfThisMonth")}
            title="当月予定で絞り込む"
            options={[
              { value: "完了", label: "完了" },
              { value: "未提出", label: "未提出" },
            ]}
          />
        )}
        {table.getColumn("scheduleStatusOfNextMonth") && (
          <DataTableFacetedFilter
            column={table.getColumn("scheduleStatusOfNextMonth")}
            title="翌月予定で絞り込む"
            options={[
              { value: "完了", label: "完了" },
              { value: "未提出", label: "未提出" },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
            className="h-8 px-2 lg:px-3"
          >
            リセット
            <Icons.filterX className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
      {/* <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Switch
                id="schedule-thismonth-notcollect"
                checked={deleted}
                onCheckedChange={(value) =>
                  router.push(
                    pathname +
                      "?" +
                      createQueryString("deleted", value.toString())
                  )
                }
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>オンにすると当月未提出の生徒のみを抽出します</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Label htmlFor="schedule-thismonth-notcollect">当月未提出</Label>
      </div> */}
    </div>
  );
}
