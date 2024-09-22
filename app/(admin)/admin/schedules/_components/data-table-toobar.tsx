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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onMultiUpdateClick: (
    schedules: ScheduleWithStudentAndFacilityAndSchool[]
  ) => void;
}

export function DataTableToolbar({
  table,
  onMultiUpdateClick,
}: DataTableToolbarProps<ScheduleWithStudentAndFacilityAndSchool>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleCsvDownload = () => {
    const data = formatAndSortForCsv(table);
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tmp.csv"); // TODO: ファイル名を決める
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex item-center justify-between">
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

      <div className="flex gap-2">
        {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
          <Button
            onClick={() =>
              onMultiUpdateClick(
                table.getSelectedRowModel().rows.map((row) => row.original)
              )
            }
          >
            <Icons.pencil className="mr-2 w-4 h-4" />
            開始時間を一括変更する
          </Button>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={handleCsvDownload}
              className={buttonVariants()}
            >
              {/* <Button onClick={handleCsvDownload}> */}
              <Icons.fileDown className="mr-2 w-4 h-4" />
              今の条件でcsvをダウンロードする
              {/* </Button> */}
            </TooltipTrigger>
            <TooltipContent>
              <p>学校、学年、開始時間でソートされます</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
