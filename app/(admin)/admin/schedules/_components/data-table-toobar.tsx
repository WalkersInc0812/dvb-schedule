import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { DateRange, isDateRange } from "react-day-picker";
import { unparse } from "papaparse";
import { ScheduleWithStudentAndFacilityAndSchool } from "@/lib/schedules";
import { formatAndSortForCsv } from "./columns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
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
  onCreateClick: () => void;
  onMultiUpdateClick: (
    schedules: ScheduleWithStudentAndFacilityAndSchool[]
  ) => void;
}

export function DataTableToolbar({
  table,
  facilities,
  schools,
  onCreateClick,
  onMultiUpdateClick,
}: DataTableToolbarProps<ScheduleWithStudentAndFacilityAndSchool>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const handleCsvDownload = () => {
    const data = formatAndSortForCsv(table);
    const csv = unparse(data);
    const bomCsv = "\uFEFF" + csv;
    const blob = new Blob([bomCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `download-${new Date().toISOString().slice(0, 10)}.csv`; // download-${yyyymmdd}-${hhmmss}.csv
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="flex gap-4 flex-col-reverse">
      <div className="flex flex-1 items-center space-x-2">
        <DatePickerWithRange
          placeholder="日付で絞り込む"
          value={
            isDateRange(table.getColumn("date")?.getFilterValue())
              ? (table.getColumn("date")?.getFilterValue() as DateRange)
              : { from: undefined }
          }
          onSelect={(value) => table.getColumn("date")?.setFilterValue(value)}
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

      <div className="flex justify-between">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  disabled={
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    )
                  }
                  onClick={() =>
                    onMultiUpdateClick(
                      table
                        .getSelectedRowModel()
                        .rows.map((row) => row.original)
                    )
                  }
                >
                  <Icons.pencil className="mr-2 w-4 h-4" />
                  登園時間を一括変更する (
                  {table.getSelectedRowModel().rows.length}件)
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>チェックを入れた登園予定の時間を一括変更できます</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={handleCsvDownload}
                className={buttonVariants()}
              >
                <Icons.fileDown className="mr-2 w-4 h-4" />
                今の条件でcsvをダウンロードする
              </TooltipTrigger>
              <TooltipContent>
                <p>学校、学年、登園時間でソートされます</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Switch
                    id="airplane-mode"
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
                  <p>オンにすると削除された登園予定も表示します</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Label htmlFor="airplane-mode">削除済を表示する</Label>
          </div>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={onCreateClick}>
                  <Icons.circlePlus className="mr-2 w-4 h-4" />
                  新規登録
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>登園予定を新しく登録するウィンドウがポップアップします</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
